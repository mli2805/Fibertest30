using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Application;

public class SnmpChannelSender : ISnmpChannelSender
{
    private readonly ILogger<SnmpChannelSender> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public SnmpChannelSender(ILogger<SnmpChannelSender> logger, IServiceScopeFactory serviceScopeFactory)
    {
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task Send(MonitoringAlarmEvent alarmEvent, CancellationToken ct)
    {
        using var scope = _serviceScopeFactory.CreateScope();

        var notificationSettingsRepository = scope.ServiceProvider.GetRequiredService<INotificationSettingsRepository>();
        var trapReceiver = await notificationSettingsRepository.GetTrapReceiver(ct);
        if (!trapReceiver.Enabled) { return; }

        var portPath = "234-21";

        var snmpContentBuilder = scope.ServiceProvider.GetRequiredService<ISnmpContentBuilder>();
        var payload = snmpContentBuilder.BuildSnmpPayload(portPath, alarmEvent);

        var snmpService = scope.ServiceProvider.GetRequiredService<ISnmpService>();
        snmpService.SendSnmpTrap(trapReceiver, (int)SnmpSpecificTrapType.OpticalAlarm, payload);
    }

  

    public Task Send(SystemEvent systemEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}