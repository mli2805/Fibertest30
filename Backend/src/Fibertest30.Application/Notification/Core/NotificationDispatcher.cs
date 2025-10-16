using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Threading.Channels;

namespace Fibertest30.Application;

public class NotificationDispatcher(
    ILogger<NotificationDispatcher> logger,
    IInAppChannelSender inAppChannelSender,
    IEmailChannelSender emailChannelSender,
    ISnmpChannelSender snmpChannelSender)
    : INotificationDispatcher, INotificationSender
{
    private readonly ILogger _logger = logger;
    private readonly Channel<INotificationEvent> _channel = Channel.CreateUnbounded<INotificationEvent>();

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
                else if (notificationEvent is AddMeasurement measurement)
                {
                    await ProcessMonitoringAlarmNotifications(measurement, ct);
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
            await inAppChannelSender.Send(systemEvent, ct);
        }
    }

    private async Task ProcessMonitoringAlarmNotifications(AddMeasurement measurement, CancellationToken ct)
    {
        try
        {
            await emailChannelSender.SendNoti(measurement, ct);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to send with _emailChannelSender");
        }

        try
        {
            await snmpChannelSender.SendNoti(measurement, ct);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to send with _snmpChannelSender");
        }

    }
}