using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Threading.Channels;

namespace Fibertest30.Application;

public class NotificationDispatcher : INotificationDispatcher, INotificationSender
{
    private readonly ILogger _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly IInAppChannelSender _inAppChannelSender;
    private readonly IEmailChannelSender _emailChannelSender;
    private readonly ISnmpChannelSender _snmpChannelSender;
    private readonly Channel<INotificationEvent> _channel = Channel.CreateUnbounded<INotificationEvent>();

    public NotificationDispatcher(ILogger<NotificationDispatcher> logger,
        IServiceScopeFactory serviceScopeFactory, IInAppChannelSender inAppChannelSender, 
        IEmailChannelSender emailChannelSender, ISnmpChannelSender snmpChannelSender)
    {
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
        _inAppChannelSender = inAppChannelSender;
        _emailChannelSender = emailChannelSender;
        _snmpChannelSender = snmpChannelSender;
    }

    public async Task Send(INotificationEvent notificationEvent, CancellationToken ct)
    {
        await _channel.Writer.WriteAsync(notificationEvent, ct);
    }

    public async Task ProcessNotifications(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                var notificationEvent = await _channel.Reader.ReadAsync(ct);
                if (notificationEvent is SystemEvent systemEvent)
                {
                    await ProcessSystemEventNotifications(systemEvent, ct);
                }
                else if (notificationEvent is MonitoringAlarmEvent monitoringAlarmEvent)
                {
                    await ProcessMonitoringAlarmNotifications(monitoringAlarmEvent, ct);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Failed while ProcessNotifications");
            }
        }
    }

    private async Task ProcessSystemEventNotifications(SystemEvent systemEvent, CancellationToken ct)
    {
        if (!SystemEventSupportedNotificationRules.Map.TryGetValue(systemEvent.Type, out var rules))
        {
            var message =
                $"A channels map should be created for event: {systemEvent.Type} in {nameof(SystemEventSupportedNotificationRules)}";
            Debug.Fail(message); // throw in Debug
            _logger.LogWarning(message); // log in Release
            return; // skip the event in Release
        }

        if (rules.ContainsKey(NotificationChannel.InAppInternal)
            || rules.ContainsKey(NotificationChannel.InApp))
        {
            await _inAppChannelSender.Send(systemEvent, ct);
        }
    }

    private async Task ProcessMonitoringAlarmNotifications(MonitoringAlarmEvent monitoringAlarmEvent, CancellationToken ct)
    {
        try
        {
            await _inAppChannelSender.Send(monitoringAlarmEvent, ct);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to send with _inAppChannelSender");
        }


        try
        {
            await _emailChannelSender.Send(monitoringAlarmEvent, ct);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to send with _emailChannelSender");
        }

        try
        {
            await _snmpChannelSender.Send(monitoringAlarmEvent, ct);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to send with _snmpChannelSender");
        }

    }
}