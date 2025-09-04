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
            SystemEventType.TraceAttached => Deserialize<TraceAttachedData>(jsonData),
            SystemEventType.TraceDetached => Deserialize<TraceDetachedData>(jsonData),
            SystemEventType.AllTracesDetached => Deserialize<AllTracesDetachedData>(jsonData),
            SystemEventType.OtauAttached => Deserialize<OtauAttachedData>(jsonData),
            SystemEventType.OtauDetached => Deserialize<OtauDetachedData>(jsonData),
            SystemEventType.TraceAdded => Deserialize<TraceAddedData>(jsonData),
            SystemEventType.TraceCleaned => Deserialize<TraceCleanedData>(jsonData),
            SystemEventType.TraceRemoved => Deserialize<TraceRemovedData>(jsonData),
            SystemEventType.RtuAdded => Deserialize<RtuAddedData>(jsonData),
            SystemEventType.RtuUpdated => Deserialize<RtuUpdatedData>(jsonData),
            SystemEventType.RtuAddressCleared => Deserialize<RtuAddressClearedData>(jsonData),
            SystemEventType.RtuRemoved => Deserialize<RtuRemovedData>(jsonData),
            SystemEventType.TraceStateChanged => Deserialize<TraceStateChangedData>(jsonData),
            SystemEventType.NetworkEventAdded => Deserialize<NetworkEventAddedData>(jsonData),
            SystemEventType.BopNetworkEventAdded => Deserialize<BopNetworkEventAddedData>(jsonData),
            SystemEventType.RtuStateAccidentAdded => Deserialize<RtuStateAccidentAddedData>(jsonData),
            SystemEventType.LandmarksUpdateProgressed => Deserialize<LandmarksUpdateProgressedData>(jsonData),
            SystemEventType.MeasurementAdded => Deserialize<MeasurementAddedData>(jsonData),
            SystemEventType.MeasurementUpdated => Deserialize<MeasurementUpdatedData>(jsonData),

            _ => throw new ArgumentException(@"SystemEventDataFactory: Invalid SystemEventType", nameof(type))
        };
    }

    private static ISystemEventData? Deserialize<T>(string jsonData) where T : ISystemEventData
    {
        if (string.IsNullOrEmpty(jsonData)) { return null; }
        return JsonSerializer.Deserialize<T>(jsonData);
    }
}