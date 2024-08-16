using Iit.Fibertest.Dto;

namespace Fibertest30.Application;

// The purpose of this factory,
// is to create SystemEvent objects with the correct data & level
public static class SystemEventFactory
{
    public static SystemEvent OnDemandFailed(string userId, string onDemandId, int monitoringPortId, string failReason)
    {
        return new SystemEvent(SystemEventType.OnDemandFailed,
            SystemEventLevel.Info,
            new OnDemandFailedData(onDemandId, monitoringPortId, failReason),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent OnDemandCompleted(string userId, string onDemandId, int monitoringPortId)
    {
        return new SystemEvent(SystemEventType.OnDemandCompleted,
            SystemEventLevel.Info,
            new OnDemandCompletedData(onDemandId, monitoringPortId),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent BaselineFailed(string userId, string taskId, int monitoringPortId, string failReason)
    {
        return new SystemEvent(SystemEventType.BaselineFailed,
            SystemEventLevel.Info,
            new BaselineFailedData(taskId, monitoringPortId, failReason),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent BaselineCompleted(string userId, string taskId, int monitoringPortId, int baselineId)
    {
        return new SystemEvent(SystemEventType.BaselineCompleted,
            SystemEventLevel.Info,
            new BaselineCompletedData(taskId, monitoringPortId, baselineId),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent OtdrTaskProgress(string userId,
        string taskId, OtdrTaskType taskType, int monitoringPortId,
        OtdrTaskProgress progress, string? failReason)
    {
        return new SystemEvent(SystemEventType.OtdrTaskProgress,
            SystemEventLevel.Internal,
            new OtdrTaskProgressData(
                taskId, taskType, monitoringPortId, userId,
                progress.QueuePosition, progress.Status, progress.Progress,
                progress.CompletedAt,
                progress.StepName, failReason),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent OtdrTaskProgress(string userId, OtdrTaskProgressData progressData)
    {
        return new SystemEvent(SystemEventType.OtdrTaskProgress,
            SystemEventLevel.Internal,
            progressData,
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent UserChanged(string userId, string changedUserId, List<string> changedProperties)
    {
        return new SystemEvent(SystemEventType.UserChanged,
            SystemEventLevel.Info,
            new UserChangedData(changedUserId, changedProperties),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent UserCreated(string userId, string createdUserId)
    {
        return new SystemEvent(SystemEventType.UserCreated,
            SystemEventLevel.Info,
            new UserCreatedData(createdUserId),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent UserDeleted(string userId, string deletedUserId)
    {
        return new SystemEvent(SystemEventType.UserDeleted,
            SystemEventLevel.Info,
            new UserDeletedData(deletedUserId),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent OtauConnectionStatusChanged
        (int otauId, bool isConnected, DateTime? onlineAt, DateTime? offlineAt)
    {
        return new SystemEvent(SystemEventType.OtauConnectionStatusChanged,
            SystemEventLevel.Info,
            new OtauConnectionStatusChangedData
            {
                OtauId = otauId,
                IsConnected = isConnected,
                OnlineAt = onlineAt,
                OfflineAt = offlineAt
            },
            SystemEventSource.FromSource(SystemEventAppSource.System.ToString()));
    }

    public static SystemEvent OtauChanged
        (int otauId, string oldSerialNumber, string newSerialNumber,
            int oldPortCount, int newPortCount,
           bool internalOnly = false)
    {
        return new SystemEvent(SystemEventType.OtauChanged,
            internalOnly ? SystemEventLevel.Internal : SystemEventLevel.Major,
            new OtauChangedData(otauId, oldSerialNumber, newSerialNumber, oldPortCount, newPortCount),
            SystemEventSource.FromSource(SystemEventAppSource.System.ToString()));
    }

    public static SystemEvent OtauInformationChanged(string userId, int otauId, List<ChangedProperty> changedProperties)
    {
        return new SystemEvent(SystemEventType.OtauInformationChanged,
            SystemEventLevel.Info,
            new OtauInformationChangedData(otauId, changedProperties),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent OtauAdded
        (string userId, int otauId, int ocmPortIndex, OtauType otauType, string serialNumber, int portCount)
    {
        return new SystemEvent(SystemEventType.OtauAdded,
            SystemEventLevel.Info,
            new OtauAddedData(otauId, ocmPortIndex, otauType.ToString(), serialNumber, portCount),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent OtauRemoved
        (string userId, int otauId, int ocmPortIndex, OtauType otauType, string serialNumber, int portCount)
    {
        return new SystemEvent(SystemEventType.OtauRemoved,
            SystemEventLevel.Info,
            new OtauRemovedData(otauId, ocmPortIndex, otauType.ToString(), serialNumber, portCount),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent MonitoringPortStatusChanged
        (string userId, int monitoringPortId, MonitoringPortStatus status)
    {
        return new SystemEvent(SystemEventType.MonitoringPortStatusChanged,
            SystemEventLevel.Info,
            new MonitoringPortStatusChangedData(monitoringPortId, status),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent MonitoringPortScheduleChanged
        (string userId, int monitoringPortId, MonitoringSchedulerMode mode, TimeSpan interval, List<int> timeSlotIds)
    {
        return new SystemEvent(SystemEventType.MonitoringPortScheduleChanged,
            SystemEventLevel.Info,
            new MonitoringPortScheduleChangedData(monitoringPortId, mode, (int)interval.TotalSeconds, timeSlotIds),
            SystemEventSource.FromUser(userId));
    }

   

    public static SystemEvent MonitoringPortNoteChanged
        (string userId, int monitoringPortId, string note)
    {
        return new SystemEvent(SystemEventType.MonitoringPortNoteChanged,
            SystemEventLevel.Internal,
            new MonitoringPortNoteChangedData(monitoringPortId, note),
            SystemEventSource.FromUser(userId));
    }

  

    public static SystemEvent NotificationSettingsUpdated(string userId, string part)
    {
        return new SystemEvent(SystemEventType.NotificationSettingsUpdated, SystemEventLevel.Info,
            new NotificationSettingsUpdatedData(part), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent UnsupportedOsmModuleConnected(int ocmPortIndex)
    {
        return new SystemEvent(SystemEventType.UnsupportedOsmModuleConnected, SystemEventLevel.Critical,
            new UnsupportedOsmModuleConnectedData(ocmPortIndex),
                SystemEventSource.FromSource("System"));
    }

    public static SystemEvent NetworkSettingsUpdated(string userId, NetworkSettings networkSettings)
    {
        return new SystemEvent(SystemEventType.NetworkSettingsUpdated, SystemEventLevel.Info,
            new NetworkSettingsUpdatedData(networkSettings), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent NtpSettingsUpdated(string userId, NtpSettings networkSettings)
    {
        return new SystemEvent(SystemEventType.NtpSettingsUpdated, SystemEventLevel.Info,
            new NtpSettingsUpdatedData(networkSettings), SystemEventSource.FromUser(userId));
    }
    public static SystemEvent TimeSettingsUpdated(string userId, TimeSettings networkSettings)
    {
        return new SystemEvent(SystemEventType.TimeSettingsUpdated, SystemEventLevel.Info,
            new TimeSettingsUpdatedData(networkSettings), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent PortLabelAttached(
        string userId, PortLabelData portLabel, int monitoringPortId)
    {
        return new SystemEvent(SystemEventType.PortLabelAttached, SystemEventLevel.Info,
            new PortLabelAttachedData(portLabel, monitoringPortId),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent PortLabelDetached(
        string userId, PortLabelData portLabel, int monitoringPortId)
    {
        return new SystemEvent(SystemEventType.PortLabelDetached, SystemEventLevel.Info,
            new PortLabelDetachedData(portLabel, monitoringPortId),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent PortLabelUpdated(
        string userId, PortLabelData oldPortLabel, PortLabelData newPortLabel)
    {
        return new SystemEvent(SystemEventType.PortLabelUpdated, SystemEventLevel.Info,
            new PortLabelUpdatedData(oldPortLabel, newPortLabel),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent RtuConnectionChecked(string userId, RtuConnectionCheckedDto dto)
    {
        return new SystemEvent(SystemEventType.RtuConnectionChecked, SystemEventLevel.Info,
            new RtuConnectionCheckedData(dto.NetAddress.ToStringA(), dto.IsConnectionSuccessfull), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent RtuInitialized(string userId, RtuInitializedDto dto, string rtuTitle)
    {
        return new SystemEvent(SystemEventType.RtuInitialized, SystemEventLevel.Info,
            new RtuInitializedData(dto.RtuId.ToString(), rtuTitle), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent MeasurementClientDone(string userId, Guid measurementClientId)
    {
        return new SystemEvent(SystemEventType.MeasurementClientDone, SystemEventLevel.Internal, 
            new MeasurementClientDoneData(measurementClientId), SystemEventSource.FromUser(userId));
    }
}