using Iit.Fibertest.Dto;

namespace Fibertest30.Application;

// The purpose of this factory,
// is to create SystemEvent objects with the correct data & level
public static class SystemEventFactory
{

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


    public static SystemEvent NotificationSettingsUpdated(string userId, string part)
    {
        return new SystemEvent(SystemEventType.NotificationSettingsUpdated, SystemEventLevel.Info,
            new NotificationSettingsUpdatedData(part), SystemEventSource.FromUser(userId));
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

    public static SystemEvent MonitoringStopped(string userId, Guid rtuId, bool isSuccess)
    {
        return new SystemEvent(SystemEventType.MonitoringStopped, SystemEventLevel.Internal,
            new MonitoringStoppedData(rtuId.ToString(), isSuccess), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent MonitoringSettingsApplied(string userId, Guid rtuId, string rtuTitle)
    {
        return new SystemEvent(SystemEventType.MonitoringSettingsApplied, SystemEventLevel.Internal,
            new MonitoringSettingsAppliedData(rtuId.ToString(), rtuTitle),
            SystemEventSource.FromUser(userId));
    }
    public static SystemEvent BaseRefsAssigned(string userId, Guid rtuId, string traceTitle)
    {
        return new SystemEvent(SystemEventType.BaseRefsAssigned, SystemEventLevel.Internal,
            new BaseRefsAssignedData(rtuId.ToString(), traceTitle),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent MeasurementAdded(int eventId, DateTime registeredAt, string obj, string objId, bool isEvent, bool isOk)
    {
        return new SystemEvent(SystemEventType.MeasurementAdded, SystemEventLevel.Critical,
            new MeasurementAddedData(eventId, registeredAt, obj, objId, isEvent, isOk), SystemEventSource.FromSource("DataCenter"));
    }

    public static SystemEvent NetworkEventAdded(int eventId, DateTime registeredAt, string obj, string objId, bool isRtuAvailable)
    {
        return new SystemEvent(SystemEventType.NetworkEventAdded, SystemEventLevel.Critical,
            new NetworkEventAddedData(eventId, registeredAt, obj, objId,isRtuAvailable), SystemEventSource.FromSource("DataCenter"));
    }

    public static SystemEvent BopNetworkEventAdded(int eventId, DateTime registeredAt, string obj, string objId, bool isOk)
    {
        return new SystemEvent(SystemEventType.BopNetworkEventAdded, SystemEventLevel.Critical,
            new BopNetworkEventAddedData(eventId, registeredAt, obj, objId, isOk), SystemEventSource.FromSource("DataCenter"));
    }

    public static SystemEvent RtuAccidentAdded(int eventId, DateTime registeredAt, string obj, string objId, bool isGoodAccident)
    {
        return new SystemEvent(SystemEventType.RtuAccidentAdded, SystemEventLevel.Critical,
            new RtuAccidentAddedData(eventId, registeredAt, obj, objId, isGoodAccident), SystemEventSource.FromSource("DataCenter"));
    }


}