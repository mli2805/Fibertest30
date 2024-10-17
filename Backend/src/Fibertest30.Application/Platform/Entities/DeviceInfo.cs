using Iit.Fibertest.Dto;

namespace Fibertest30.Application;

public class DeviceInfo
{
    public string ApiVersion { get; set; } = null!;
    public NotificationSettings NotificationSettings { get; set; } = null!;
    

    public List<RtuDto> RtuTree { get; set; } = null!;
    public HasCurrentEvents HasCurrentEvents { get; set; } = null!;
}