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
}