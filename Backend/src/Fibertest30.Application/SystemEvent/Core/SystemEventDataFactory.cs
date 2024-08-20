using System.Text.Json;

namespace Fibertest30.Application;

public static class SystemEventDataFactory
{
    public static ISystemEventData? Create(SystemEventType type, string jsonData)
    {
        return type switch
        {
            SystemEventType.UserChanged => Deserialize<UserChangedData>(jsonData),
            SystemEventType.UserCreated => Deserialize<UserCreatedData>(jsonData),
            SystemEventType.UserDeleted => Deserialize<UserDeletedData>(jsonData),
            SystemEventType.NotificationSettingsUpdated => Deserialize<NotificationSettingsUpdatedData>(jsonData),
            SystemEventType.RtuConnectionChecked => Deserialize<RtuConnectionCheckedData>(jsonData),
            SystemEventType.RtuInitialized => Deserialize<RtuInitializedData>(jsonData),
            SystemEventType.MeasurementClientDone => Deserialize<MeasurementClientDoneData>(jsonData),

            _ => throw new ArgumentException("SystemEventDataFactory: Invalid SystemEventType", nameof(type))
        };
    }

    private static ISystemEventData? Deserialize<T>(string jsonData) where T : ISystemEventData
    {
        if (string.IsNullOrEmpty(jsonData)) { return null; }
        return JsonSerializer.Deserialize<T>(jsonData);
    }
}