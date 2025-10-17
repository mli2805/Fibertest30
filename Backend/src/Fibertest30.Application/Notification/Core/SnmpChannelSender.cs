using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace Fibertest30.Application;

public class SnmpChannelSender(IServiceScopeFactory serviceScopeFactory, ILogger<ISnmpChannelSender> logger)
    : ISnmpChannelSender
{
    public async Task SendNoti<T>(T o, CancellationToken ct) where T: INotificationEvent
    {
        using var scope = serviceScopeFactory.CreateScope();
        var notificationSettingsRepository = scope.ServiceProvider.GetRequiredService<INotificationSettingsRepository>();
        var trapReceiver = await notificationSettingsRepository.GetTrapReceiver(ct);
        if (!trapReceiver.Enabled) { return; }

        var model = scope.ServiceProvider.GetRequiredService<Model>();
        var snmpContentBuilder = scope.ServiceProvider.GetRequiredService<ISnmpContentBuilder>();
        var pair = Create(o, snmpContentBuilder, model, trapReceiver.SnmpLanguage);

        if (pair.Item1 == null) return;

        var snmpService = scope.ServiceProvider.GetRequiredService<ISnmpService>();
        snmpService.SendSnmpTrap(trapReceiver, (FtTrapType)pair.Item1, pair.Item2!);
        logger.LogInformation("SNMP trap sent");
    }

    private (FtTrapType?, Dictionary<FtTrapProperty, string>?) Create(
        object e, ISnmpContentBuilder snmpContentBuilder, Model model, string language)
    {
        var prevCulture = Thread.CurrentThread.CurrentUICulture;

        var cultureInfo = new CultureInfo(language) { NumberFormat = { NumberDecimalSeparator = @"." } };
        Thread.CurrentThread.CurrentCulture = cultureInfo;
        Thread.CurrentThread.CurrentUICulture = cultureInfo;

        (FtTrapType?, Dictionary<FtTrapProperty, string>?) result = (null, null);
        switch (e)
        {
            case AddMeasurement measurement: 
                result = (FtTrapType.OpticalEvent, snmpContentBuilder.BuildSnmpPayload(measurement, model)); 
                break;
            case NetworkEvent networkEvent:
                result = (FtTrapType.RtuNetworkEvent, snmpContentBuilder.BuildSnmpPayload(networkEvent, model)); 
                break;
            case BopNetworkEvent bopNetworkEvent: 
                result = (FtTrapType.BopNetworkEvent, snmpContentBuilder.BuildSnmpPayload(bopNetworkEvent, model)); 
                break;
            case RtuAccident rtuAccident:
                result = (FtTrapType.RtuStatusEvent, snmpContentBuilder.BuildSnmpPayload(rtuAccident, model));
                break;
        }

        Thread.CurrentThread.CurrentCulture = prevCulture;
        Thread.CurrentThread.CurrentUICulture = prevCulture;

        return result;
    }

  


    public Task Send(SystemEvent systemEvent, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}