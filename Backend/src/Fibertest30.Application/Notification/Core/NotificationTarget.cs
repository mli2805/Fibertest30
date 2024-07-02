namespace Fibertest30.Application;

[Flags]
public enum NotificationTarget
{
    Me = 1,
    Others = 2,
    All = Me | Others
}