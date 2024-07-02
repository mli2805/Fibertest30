namespace Fibertest30.Application;

public interface IChannelSender
{
    Task Send(MonitoringAlarmEvent alarmEvent, CancellationToken ct);
    Task Send(SystemEvent systemEvent, CancellationToken ct);

}

