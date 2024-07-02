using MediatR;

namespace Fibertest30.Application;

public record GetDeviceInfoQuery() : IRequest<DeviceInfo>;

public class GetDeviceInfoQueryHandler : IRequestHandler<GetDeviceInfoQuery, DeviceInfo>
{
    private readonly IDeviceInfoProvider _deviceInfoProvider;
    private readonly IOtdr _otdr;
    private readonly IOtauService _otauService;
    private readonly IMonitoringPortRepository _monitoringPortRepository;
    private readonly IAlarmProfileRepository _alarmProfileRepository;
    private readonly IMonitoringAlarmRepository _monitoringAlarmRepository;
    private readonly INotificationSettingsRepository _notificationSettingsRepository;
    private readonly INetworkSettingsProvider _networkSettingsProvider;
    private readonly IVersionProvider _versionProvider;
    private readonly INtpSettingsProvider _ntpSettingsProvider;
    private readonly IPortLabelRepository _portLabelRepository;

    public GetDeviceInfoQueryHandler(
        IDeviceInfoProvider deviceInfoProvider,
        IOtdr otdr, 
        IOtauService otauService,
        IMonitoringPortRepository monitoringPortRepository, 
        IAlarmProfileRepository alarmProfileRepository,
        IMonitoringAlarmRepository monitoringAlarmRepository,
        INotificationSettingsRepository notificationSettingsRepository,
        INetworkSettingsProvider networkSettingsProvider,
        IVersionProvider versionProvider,
        INtpSettingsProvider ntpSettingsProvider,
        IPortLabelRepository portLabelRepository)
    {
        _deviceInfoProvider = deviceInfoProvider;
        _otdr = otdr;
        _otauService = otauService;
        _monitoringPortRepository = monitoringPortRepository;
        _alarmProfileRepository = alarmProfileRepository;
        _monitoringAlarmRepository = monitoringAlarmRepository;
        _notificationSettingsRepository = notificationSettingsRepository;
        _networkSettingsProvider = networkSettingsProvider;
        _versionProvider = versionProvider;
        _ntpSettingsProvider = ntpSettingsProvider;
        _portLabelRepository = portLabelRepository;
    }

    public async Task<DeviceInfo> Handle(GetDeviceInfoQuery request, CancellationToken ct)
    {
       var otaus = await _otauService.GetAllOtau(ct);
       var monitoringPorts = await _monitoringPortRepository.GetAllMonitoringPorts(ct);
       var monitoringTimeSlots = await _monitoringPortRepository.GetMonitoringTimeSlots(ct);
       var alarmProfiles = await _alarmProfileRepository.GetAll(ct);
       var notificationSettings = await _notificationSettingsRepository.GetSettingsWithoutPasswords(ct);
       var networkSettings = await _networkSettingsProvider.GetNetworkSettings(ct);
       var activeAlarms = await _monitoringAlarmRepository.GetAllActiveAlarms(true, ct);
       var portLabels = await _portLabelRepository.GetAll(ct);
       var timeSettings = new TimeSettings()
       {
           TimeZone = _deviceInfoProvider.GetTimeZone().ToAppTimeZone(),
           NtpSettings = await _ntpSettingsProvider.GetNtpSettings(ct),
       };

       var deviceInfo = new DeviceInfo
        {
            SerialNumber = _deviceInfoProvider.GetSerialNumber(),
            IpV4Address = _deviceInfoProvider.GetIpV4Address(),
            Timezone = _deviceInfoProvider.GetTimeZone().ToAppTimeZone(),
            ApiVersion = _versionProvider.GetApiVersion(),
            SupportedMeasurementParameters = _otdr.SupportedMeasurementParameters,
            Otaus = otaus,
            MonitoringPorts = monitoringPorts,
            MonitoringTimeSlots = monitoringTimeSlots,
            AlarmProfiles = alarmProfiles,
            NotificationSettings = notificationSettings,
            NetworkSettings = networkSettings,
            ActiveAlarms = activeAlarms,
            TimeSettings = timeSettings,
            PortLabels = portLabels
        };

        return deviceInfo;
    }
}