using System.Text.Json;

namespace Fibertest30.Application;

public static class SystemEventDataFactory
{
    public static ISystemEventData? Create(SystemEventType type, string jsonData)
    {
        return type switch
        {
            SystemEventType.OnDemandFailed => Deserialize<OnDemandFailedData>(jsonData),
            SystemEventType.OnDemandCompleted => Deserialize<OnDemandCompletedData>(jsonData),
            SystemEventType.UserChanged => Deserialize<UserChangedData>(jsonData),
            SystemEventType.UserCreated => Deserialize<UserCreatedData>(jsonData),
            SystemEventType.UserDeleted => Deserialize<UserDeletedData>(jsonData),
            SystemEventType.OtauConnectionStatusChanged => Deserialize<OtauConnectionStatusChangedData>(jsonData),
            SystemEventType.OtauChanged => Deserialize<OtauChangedData>(jsonData),
            SystemEventType.OtauInformationChanged => Deserialize<OtauInformationChangedData>(jsonData),
            SystemEventType.OtauAdded => Deserialize<OtauAddedData>(jsonData),
            SystemEventType.OtauRemoved => Deserialize<OtauRemovedData>(jsonData),
            SystemEventType.MonitoringPortStatusChanged => Deserialize<MonitoringPortStatusChangedData>(jsonData),
            SystemEventType.MonitoringPortScheduleChanged => Deserialize<MonitoringPortScheduleChangedData>(jsonData),
            SystemEventType.MonitoringPortNoteChanged => Deserialize<MonitoringPortNoteChangedData>(jsonData),
            SystemEventType.BaselineFailed => Deserialize<BaselineFailedData>(jsonData),
            SystemEventType.BaselineCompleted => Deserialize<BaselineCompletedData>(jsonData),
            SystemEventType.OtdrTaskProgress => Deserialize<OtdrTaskProgressData>(jsonData),
            SystemEventType.NotificationSettingsUpdated => Deserialize<NotificationSettingsUpdatedData>(jsonData),
            SystemEventType.UnsupportedOsmModuleConnected => Deserialize<UnsupportedOsmModuleConnectedData>(jsonData),
            SystemEventType.NetworkSettingsUpdated => Deserialize<NetworkSettingsUpdatedData>(jsonData),
            SystemEventType.NtpSettingsUpdated => Deserialize<NtpSettingsUpdatedData>(jsonData),
            SystemEventType.TimeSettingsUpdated => Deserialize<TimeSettingsUpdatedData>(jsonData),
            SystemEventType.PortLabelAttached => Deserialize<PortLabelAttachedData>(jsonData),
            SystemEventType.PortLabelUpdated => Deserialize<PortLabelUpdatedData>(jsonData),
            SystemEventType.PortLabelDetached => Deserialize<PortLabelDetachedData>(jsonData),
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