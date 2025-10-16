using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public class InAppSystemEventNotification : INotificationEvent
{
    public SystemEvent SystemEvent { get; set; } = null!;
    
    public bool InAppInternal { get; set; }
    public bool InApp { get; set; }
}
