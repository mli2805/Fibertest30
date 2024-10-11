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
            SystemEventType.MonitoringStopped => Deserialize<MonitoringStoppedData>(jsonData),
            SystemEventType.MonitoringSettingsApplied => Deserialize<MonitoringSettingsAppliedData>(jsonData),
            SystemEventType.BaseRefsAssigned => Deserialize<BaseRefsAssignedData>(jsonData),
            SystemEventType.MeasurementAdded => Deserialize<MeasurementAddedData>(jsonData),
            SystemEventType.NetworkEventAdded => Deserialize<MeasurementAddedData>(jsonData),
            SystemEventType.BopNetworkEventAdded => Deserialize<BopNetworkEventAddedData>(jsonData),
            SystemEventType.RtuAccidentAdded => Deserialize<RtuAccidentAddedData>(jsonData),

            _ => throw new ArgumentException(@"SystemEventDataFactory: Invalid SystemEventType", nameof(type))
        };
    }

    private static ISystemEventData? Deserialize<T>(string jsonData) where T : ISystemEventData
    {
        if (string.IsNullOrEmpty(jsonData)) { return null; }
        return JsonSerializer.Deserialize<T>(jsonData);
    }
}