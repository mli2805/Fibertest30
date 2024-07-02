using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Reactive.Linq;
using System.Reactive.Subjects;
using System.Threading.Channels;

namespace Fibertest30.Application;

public class SystemEventDispatcher : ISystemEventDispatcher, ISystemEventSender
{
    private readonly Subject<SystemEvent> _systemEvents = new();
    
    private readonly ILogger _logger;
    private readonly IDateTime _dateTime;
    private readonly INotificationSender _notificationSender;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly Channel<SystemEvent> _channel = Channel.CreateUnbounded<SystemEvent>();
    
    public SystemEventDispatcher(
        ILogger<NotificationDispatcher> logger,
        IDateTime dateTime,
        INotificationSender notificationSender,
        IServiceScopeFactory serviceScopeFactory
        )
    {
        _logger = logger;
        _dateTime = dateTime;
        _notificationSender = notificationSender;
        _serviceScopeFactory = serviceScopeFactory;
    }
    
    public async Task Send(SystemEvent systemEvent)
    {
        systemEvent.At = _dateTime.UtcNow;
        await _channel.Writer.WriteAsync(systemEvent);
    }
    
    public async Task ProcessSystemEvents(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            var systemEvent = await _channel.Reader.ReadAsync(ct);
            
            if (systemEvent.Level != SystemEventLevel.Internal)
            {
                // save to the database
                systemEvent.Id = await SaveToTheDatabase(systemEvent, ct);
            }
            
            // send to the subscribers
            _systemEvents.OnNext(systemEvent);
            
            // add to the notifications
            await _notificationSender.Send(systemEvent, ct);

            if (systemEvent.Level != SystemEventLevel.Internal)
            {
                // log
                _logger.LogInformation("SystemEvent: at={At} type={Type} level={Level} source={@Source}"
                    , systemEvent.At.ToLogDateTime(), systemEvent.Type, systemEvent.Level, systemEvent.Source);
            }
        }
    }
    
    public IObservable<SystemEvent> GetEventStream()
    {
        return _systemEvents.AsObservable();
    }

    private async Task<int> SaveToTheDatabase(SystemEvent systemEvent, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var systemEventRepository = scope.ServiceProvider.GetRequiredService<ISystemEventRepository>();

        return await systemEventRepository.Add(systemEvent, ct);
    }
}