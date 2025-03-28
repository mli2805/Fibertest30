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
        var exists = _eventStoreInitializer.IsFt20GraphExists();
        _eventStoreInitializer.StreamIdOriginal = exists 
            ? await _eventStoreInitializer.GetStreamId() 
            : Guid.NewGuid();

        await InitializeEventStoreService();
    }

    private async Task<int> InitializeEventStoreService()
    {
        _eventStoreInitializer.Init(); // если не существует - будет создана
        
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

        // 

        // // на версии 2.5 выгрузил snapshot в json
        // //        _writeModel.WriteToJsonFile(@"c:\temp\model.json");
        // // 
        // // беру из json файла модель - в ней есть координаты узлов
        // Model? snapshotModel = ModelJsonSerializationExt.ReadFromJsonFile(@"c:\temp\model.json");
        // if (snapshotModel != null)
        // {
        //     // сериализую старым методом
        //     byte[]? bytes = await snapshotModel.Serialize(_logger);
        //
        //     if (bytes != null)
        //     {
        //         Model forCheck = new Model();
        //         // и десериализую обратно, чтобы убедиться, что сериализация - десериализация не портят координаты
        //         var result = await forCheck.Deserialize(_logger, bytes);
        //         if (result)
        //         {
        //             await _snapshotRepository.RemoveOldSnapshots(); // не работает, придется руками удалить, не забыть применить удаление
        //
        //             // записываю заново с теми же параметрами
        //             // await _snapshotRepository
        //             //     .AddSnapshotAsync(Guid.Parse("1c28cbb5-a9f5-4a5c-b7af-3d188f8f24ed"),
        //             //     106836, new DateTime(2024, 1, 31), bytes);
        //             await _snapshotRepository
        //                 .AddSnapshotAsync(Guid.Parse("53e252c5-a855-4add-8a1a-13f8e506b92d"),
        //                 2144, new DateTime(2025, 1, 13), bytes);
        //         }
        //     }
        //    
        //
        //     _eventLogComposer.Initialize();
        // }
       
        ////////////


        // var eventStream = _eventStoreInitializer.StoreEvents.OpenStream(_eventStoreInitializer.StreamIdOriginal);

        if (LastEventNumberInSnapshot == 0 && _eventStoreInitializer.EventStream.CommittedEvents.FirstOrDefault() == null)
        {
            // если бд пустая задаем ID
            _eventStoreInitializer.StreamIdOriginal = Guid.NewGuid();

            foreach (var cmd in DbSeeds.Collection)
                await SendCommand(cmd, "developer", "OnServer");
            _logger.LogInformation("Empty graph is seeded with default zone and users.");
        }

        var eventMessages = _eventStoreInitializer.EventStream.CommittedEvents.ToList();
        _logger.LogInformation($"{eventMessages.Count} events should be applied...");
        foreach (var eventMessage in eventMessages)
        {
            _writeModel.Apply(eventMessage.Body);
            AddEventToLog(eventMessage);
        }
        _logger.LogInformation("Events applied successfully.");
        _logger.LogInformation($"Last event number is {LastEventNumberInSnapshot + eventMessages.Count}");

        var msg = _eventStoreInitializer.EventStream.CommittedEvents.LastOrDefault();
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
        // var eventStream = _eventStoreInitializer.StoreEvents.OpenStream(_eventStoreInitializer.StreamIdOriginal);
        foreach (var e in _eventsQueue.EventsWaitingForCommit)   // takes already applied event(s) from WriteModel's list
        {
            var eventMessage = WrapEvent(e, username, clientIp);
            _eventStoreInitializer.EventStream.Add(eventMessage);   // and stores this event in BD
            AddEventToLog(eventMessage);
        }

        _eventsQueue.Commit();                                     // now cleans WriteModel's list
        _eventStoreInitializer.EventStream.CommitChanges(Guid.NewGuid());
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
