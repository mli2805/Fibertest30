using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;
using NEventStore;

namespace Fibertest30.Infrastructure;
public class EventStoreService : IEventStoreService
{
    private readonly ILogger<EventStoreService> _logger;
    private readonly Model _writeModel;
    private readonly EventStoreInitializer _eventStoreInitializer;
    private readonly SnapshotRepository _snapshotRepository;
    private readonly EventLogComposer _eventLogComposer;
    private readonly EventToLogLineParser _eventToLogLineParser;
    private readonly CommandAggregator _commandAggregator;
    private readonly EventsQueue _eventsQueue;

    public int LastEventNumberInSnapshot;
    public DateTime LastEventDateInSnapshot;

    public EventStoreService(ILogger<EventStoreService> logger, Model writeModel,
        EventStoreInitializer eventStoreInitializer, SnapshotRepository snapshotRepository,
        EventLogComposer eventLogComposer, EventToLogLineParser eventToLogLineParser,
        CommandAggregator commandAggregator, EventsQueue eventsQueue)
    {
        _logger = logger;
        _writeModel = writeModel;
        _eventStoreInitializer = eventStoreInitializer;
        _snapshotRepository = snapshotRepository;
        _eventLogComposer = eventLogComposer;
        _eventToLogLineParser = eventToLogLineParser;
        _commandAggregator = commandAggregator;
        _eventsQueue = eventsQueue;
    }

    public async Task InitializeBothDbAndService()
    {
        _eventStoreInitializer.StreamIdOriginal = _eventStoreInitializer.GetStreamIdIfExists();
        await InitializeEventStoreService();
    }

    private async Task<int> InitializeEventStoreService()
    {
        _eventStoreInitializer.Init();

        var snapshot = await _snapshotRepository.ReadSnapshotAsync(_eventStoreInitializer.StreamIdOriginal);
        if (snapshot == null)
        {
            LastEventNumberInSnapshot = 0;
            LastEventDateInSnapshot = DateTime.MinValue;
        }
        else
        {
            LastEventNumberInSnapshot = snapshot.Item1;
            LastEventDateInSnapshot = snapshot.Item3;
            if (!await _writeModel.Deserialize(_logger, snapshot.Item2))
                return -1;
            _eventLogComposer.Initialize();
        }

        var eventStream = _eventStoreInitializer.StoreEvents.OpenStream(_eventStoreInitializer.StreamIdOriginal);

        if (LastEventNumberInSnapshot == 0 && eventStream.CommittedEvents.FirstOrDefault() == null)
        {
            foreach (var cmd in DbSeeds.Collection)
                await SendCommand(cmd, "developer", "OnServer");
            _logger.LogInformation("Empty graph is seeded with default zone and users.");
        }

        var eventMessages = eventStream.CommittedEvents.ToList();
        _logger.LogInformation($"{eventMessages.Count} events should be applied...");
        foreach (var eventMessage in eventMessages)
        {
            _writeModel.Apply(eventMessage.Body);
            AddEventToLog(eventMessage);
        }
        _logger.LogInformation("Events applied successfully.");
        _logger.LogInformation($"Last event number is {LastEventNumberInSnapshot + eventMessages.Count}");

        var msg = eventStream.CommittedEvents.LastOrDefault();
        if (msg != null)
            _logger.LogInformation($@"Last applied event has timestamp {msg.Headers["Timestamp"]:O}");

        _logger.LogInformation($"{_writeModel.Rtus.Count} RTU found");

        return eventMessages.Count;
    }

    public Task<int> SendCommands(List<object> cmds, string? username, string clientIp)
    {
        foreach (var cmd in cmds)
        {
            var result = _commandAggregator.Validate(cmd);
            if (!string.IsNullOrEmpty(result))
                _logger.LogError(result);
        }

        StoreEventsInDb(username, clientIp);
        return Task.FromResult(cmds.Count);
    }

    public Task<string?> SendCommand(object cmd, string? username, string clientIp)
    {
        // ilya: can pass user id\role as an argument to When to check permissions
        var result = _commandAggregator.Validate(cmd); // Aggregate checks if command is valid
        // and if so, transforms command into event and passes it to WriteModel
        // WriteModel applies event and returns whether event was applied successfully

        if (result == null)                                   // if command was valid and applied successfully it should be persisted
            StoreEventsInDb(username, clientIp);
        return Task.FromResult(result);
    }

    private void StoreEventsInDb(string? username, string clientIp)
    {
        var eventStream = _eventStoreInitializer.StoreEvents.OpenStream(_eventStoreInitializer.StreamIdOriginal);
        foreach (var e in _eventsQueue.EventsWaitingForCommit)   // takes already applied event(s) from WriteModel's list
        {
            var eventMessage = WrapEvent(e, username, clientIp);
            eventStream.Add(eventMessage);   // and stores this event in BD
            AddEventToLog(eventMessage);
        }

        _eventsQueue.Commit();                                     // now cleans WriteModel's list

        eventStream.CommitChanges(Guid.NewGuid());
    }

    private void AddEventToLog(EventMessage msg)
    {
        var username = (string)msg.Headers[@"Username"];
        var clientIp = (string)msg.Headers[@"ClientIp"];
        var timestamp = (DateTime)msg.Headers[@"Timestamp"];
        var line = _eventToLogLineParser.ParseEventBody(msg.Body);
        if (line == null) return;

        _eventLogComposer.AddEventToLog(username, clientIp, timestamp, line);

    }

    private EventMessage WrapEvent(object e, string? username, string clientIp)
    {
        var msg = new EventMessage();
        msg.Headers.Add("Timestamp", DateTime.Now);
        msg.Headers.Add("Username", username ?? "");
        msg.Headers.Add("ClientIp", clientIp);
        msg.Headers.Add("VersionId", _eventStoreInitializer.StreamIdOriginal);
        msg.Body = e;
        return msg;
    }
}
