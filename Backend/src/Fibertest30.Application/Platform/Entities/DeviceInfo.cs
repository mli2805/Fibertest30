using Iit.Fibertest.Dto;

namespace Fibertest30.Application;

public class DeviceInfo
{
    public string SerialNumber { get; set; } = null!;
    public string IpV4Address { get; set; } = null!;
    public AppTimeZone Timezone { get; set; } = null!;
    
    public string ApiVersion { get; set; } = null!;
    public OtdrMeasurementParameterSet SupportedMeasurementParameters { get; set; } = null!;
    public List<CombinedOtau> Otaus { get; set; } = null!;
    public List<MonitoringPort> MonitoringPorts { get; set; } = null!;
    public List<MonitoringTimeSlot> MonitoringTimeSlots { get; set; } = null!;
    public List<AlarmProfile> AlarmProfiles { get; set; } = null!;
    public NotificationSettings NotificationSettings { get; set; } = null!;
    public NetworkSettings NetworkSettings { get; set; } = null!;
    public List<MonitoringAlarm> ActiveAlarms { get; set; } = null!;
    public NtpSettings NtpSettings { get; set; } = null!;
    public TimeSettings TimeSettings { get; set; } = null!;
    
    public List<PortLabel> PortLabels { get; set; } = null!;

    public List<RtuDto> RtuTree { get; set; } = null!;
}