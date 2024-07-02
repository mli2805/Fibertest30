namespace Fibertest30.Api;

public static class SystemEventMappingExtensions
{
    public static SystemEvent ToProto(this Fibertest30.Application.SystemEvent systemEvent)
    {
        return new SystemEvent()
        {
            Id = systemEvent.Id,
            Type = systemEvent.Type.ToString(),
            Level = systemEvent.Level.ToProto(),
            JsonData = systemEvent.Data?.ToJsonData() ?? string.Empty,
            Source = new SystemEventSource()
            {
                UserId = systemEvent.Source.UserId ?? string.Empty,
                Source = systemEvent.Source.Source ?? string.Empty
            },
            At = systemEvent.At.ToTimestamp(),
        };
    }

    public static InAppSystemNotification ToProto(
        this InAppSystemEventNotification systemEventNotification)
    {
        return new InAppSystemNotification
        {
            SystemEvent = systemEventNotification.SystemEvent.ToProto(),
            InAppInternal = systemEventNotification.InAppInternal,
            InApp = systemEventNotification.InApp
        };
    }
    
    public static SystemEventLevel ToProto(this Fibertest30.Application.SystemEventLevel level)
    {
        return level switch
        {
            Fibertest30.Application.SystemEventLevel.Info => SystemEventLevel.Info,
            Fibertest30.Application.SystemEventLevel.Major => SystemEventLevel.Major,
            Fibertest30.Application.SystemEventLevel.Critical => SystemEventLevel.Critical,
            Fibertest30.Application.SystemEventLevel.Internal => SystemEventLevel.Internal,
            _ => throw new ArgumentOutOfRangeException(nameof(level), level, null)
        };
    }
    
    public static Fibertest30.Application.SystemEventLevel FromProto(this SystemEventLevel level)
    {
        return level switch
        {
            SystemEventLevel.Info => Fibertest30.Application.SystemEventLevel.Info,
            SystemEventLevel.Major => Fibertest30.Application.SystemEventLevel.Major,
            SystemEventLevel.Critical => Fibertest30.Application.SystemEventLevel.Critical,
            _ => throw new ArgumentOutOfRangeException(nameof(level), level, null)
        };
    }
}