namespace Fibertest30.Application;

// How to create a system event with a notification:
// - Add a new item to SystemEventType
// - Create data class (if any) at SystemEvent/EventData/ (should implement ISystemEventData)
// - Create a method in SystemEventFactory
// - Add switch for the data (if any) SystemEventDataFactory
// - Add rule in SystemEventSupportedNotificationRules

// DO NOT change the name of enum values. They are stored in the database as strings.
public enum SystemEventType
{
    Unknown,
    UserChanged,
    UserCreated,
    UserDeleted,
    OtauConnectionStatusChanged,
    OtauChanged,
    OtauInformationChanged,
    OtauAdded,
    OtauRemoved,
    MonitoringPortStatusChanged,
    MonitoringPortScheduleChanged,
    MonitoringPortNoteChanged,
    BaselineFailed,
    BaselineCompleted,
    OtdrTaskProgress,
    NotificationSettingsUpdated,
    UnsupportedOsmModuleConnected,
    NetworkSettingsUpdated,
    NtpSettingsUpdated,
    TimeSettingsUpdated,
    PortLabelAttached,
    PortLabelUpdated,
    PortLabelDetached,

    RtuConnectionChecked,
    RtuInitialized,
    MeasurementClientDone,
    MonitoringStopped,
    MonitoringSettingsApplied,
    BaseRefsAssigned,
    TraceAttached,
    TraceDetached,
    OtauAttached,
    OtauDetached,

    TraceAdded,
    TraceCleaned,
    TraceRemoved,

    RtuAdded,
    RtuUpdated,
    RtuRemoved,

    AnyTypeAccidentAdded,
}