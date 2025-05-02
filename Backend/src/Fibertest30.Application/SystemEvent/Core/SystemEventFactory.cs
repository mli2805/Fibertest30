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
    public static SystemEvent BaseRefsAssigned(string userId, Guid rtuId, Guid traceId, string traceTitle, bool hasBaseRefs)
    {
        return new SystemEvent(SystemEventType.BaseRefsAssigned, SystemEventLevel.Internal,
            new BaseRefsAssignedData(rtuId.ToString(), traceId.ToString(), traceTitle, hasBaseRefs),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent TraceAttached(string userId, Guid traceId, string traceTitle, string portPath,
        Guid rtuId, string rtuTitle)
    {
        return new SystemEvent(SystemEventType.TraceAttached, SystemEventLevel.Internal,
            new TraceAttachedData(traceId.ToString(), traceTitle, portPath, rtuId.ToString(), rtuTitle),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent TraceDetached(string userId, Guid traceId, string traceTitle, string rtuId)
    {
        return new SystemEvent(SystemEventType.TraceDetached, SystemEventLevel.Internal,
            new TraceDetachedData(traceId.ToString(), traceTitle, rtuId),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent OtauAttached(string userId, string otauAddress, string serial, int mainCharonPort,
        Guid rtuId, string rtuTitle)
    {
        return new SystemEvent(SystemEventType.OtauAttached, SystemEventLevel.Internal,
            new OtauAttachedData(otauAddress, serial, mainCharonPort, rtuId.ToString(), rtuTitle),
            SystemEventSource.FromUser(userId));
    }
    public static SystemEvent OtauDetached(string userId, string otauAddress, Guid rtuId)
    {
        return new SystemEvent(SystemEventType.OtauAttached, SystemEventLevel.Internal,
            new OtauDetachedData(otauAddress, rtuId.ToString()),
            SystemEventSource.FromUser(userId));
    }

    public static SystemEvent TraceAdded(string userId, Guid traceId, Guid rtuId)
    {
        return new SystemEvent(SystemEventType.TraceAdded, SystemEventLevel.Internal,
            new TraceAddedData(traceId.ToString(), rtuId.ToString()), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent TraceCleaned(string userId, Guid traceId)
    {
        return new SystemEvent(SystemEventType.TraceCleaned, SystemEventLevel.Internal,
            new TraceCleanedData(traceId.ToString()), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent TraceRemoved(string userId, Guid traceId)
    {
        return new SystemEvent(SystemEventType.TraceRemoved, SystemEventLevel.Internal,
            new TraceRemovedData(traceId.ToString()), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent RtuAdded(string userId, Guid traceId)
    {
        return new SystemEvent(SystemEventType.RtuAdded, SystemEventLevel.Internal,
            new RtuAddedData(traceId.ToString()), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent RtuUpdated(string userId, Guid traceId)
    {
        return new SystemEvent(SystemEventType.RtuUpdated, SystemEventLevel.Internal,
            new RtuUpdatedData(traceId.ToString()), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent RtuRemoved(string userId, Guid traceId)
    {
        return new SystemEvent(SystemEventType.RtuRemoved, SystemEventLevel.Internal,
            new RtuRemovedData(traceId.ToString()), SystemEventSource.FromUser(userId));
    }

    public static SystemEvent TraceStateChanged(int eventId, DateTime registeredAt, string traceId, 
        string traceTitle, string rtuId, BaseRefType baseRefType, FiberState traceState)
    {
        return new SystemEvent(SystemEventType.TraceStateChanged, SystemEventLevel.Critical,
            new TraceStateChangedData( eventId, registeredAt, traceId, traceTitle, rtuId, baseRefType, traceState),
            SystemEventSource.FromSource("DataCenter"));
    }

    public static SystemEvent NetworkEventAdded(int eventId,
        DateTime registeredAt, string rtuTitle, string rtuId, bool isOk)
    {
        return new SystemEvent(SystemEventType.NetworkEventAdded, SystemEventLevel.Critical,
            new NetworkEventAddedData(eventId, registeredAt, rtuTitle, rtuId, isOk), 
            SystemEventSource.FromSource("DataCenter"));
    }

    public static SystemEvent BopNetworkEventAdded(int eventId,
        DateTime registeredAt, string bopIp, string bopId, string rtuId, bool isOk)
    {
        return new SystemEvent(SystemEventType.BopNetworkEventAdded, SystemEventLevel.Critical,
            new BopNetworkEventAddedData(eventId, registeredAt, bopIp, bopId, rtuId, isOk),
            SystemEventSource.FromSource("DataCenter"));
    }

    public static SystemEvent RtuStateAccidentAdded(int eventId,
        DateTime registeredAt, string objTitle, string objId, string rtuId, bool isOk)
    {
        return new SystemEvent(SystemEventType.RtuStateAccidentAdded, SystemEventLevel.Critical,
            new RtuStateAccidentAddedData(eventId, registeredAt, objTitle, objId, rtuId, isOk),
            SystemEventSource.FromSource("DataCenter"));
    }
}