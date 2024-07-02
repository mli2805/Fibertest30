using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Application;

public class MonitoringAlarmService : IMonitoringAlarmService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly INotificationSender _notificationSender;
    
    public MonitoringAlarmService(IServiceScopeFactory serviceScopeFactory
        , INotificationSender notificationSender)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _notificationSender = notificationSender;
    }

    public async Task ProcessMonitoringChanges(int monitoringPortId, int monitoringId,
        int baselineId, List<MonitoringChange> changes, CancellationToken ct)
    {
        var alarms = await GetMonitoringPortAlarms(monitoringPortId, ct);
        var ctx = new AlarmProcessingContext(alarms, changes);

        await SaveAlarmProcessing(monitoringPortId, monitoringId, baselineId, ctx, ct);
    }

    private async Task SaveAlarmProcessing(int monitoringPortId, int monitoringId, int baselineId, 
        AlarmProcessingContext ctx, 
        CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringAlarmRepository = scope.ServiceProvider.GetRequiredService<IMonitoringAlarmRepository>();

        var alarmEvents = await monitoringAlarmRepository.SaveAlarmProcessing(monitoringPortId, monitoringId, baselineId, ctx, ct);

        foreach (var alarmEvent in alarmEvents)       
        {
            await _notificationSender.Send(alarmEvent, ct);
        }
    }


    private async Task<List<MonitoringAlarm>> GetMonitoringPortAlarms(int monitoringPortId, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var monitoringAlarmRepository = scope.ServiceProvider.GetRequiredService<IMonitoringAlarmRepository>();

        var alarms = await monitoringAlarmRepository.GetMonitoringPortAlarms(monitoringPortId, ct);
        return alarms;
    }
}