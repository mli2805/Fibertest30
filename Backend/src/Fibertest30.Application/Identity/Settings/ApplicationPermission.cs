namespace Fibertest30.Application;

public enum ApplicationPermission
{
    SetupMonitoringThresholds,
    HandleAlarm,
    ViewDataLog,
    ReceiveOpticalNotifications,
    ReceiveSystemNotifications,
    EditUsers,
    ChangeNotificationSettings,

    EditGraph,
    CheckRtuConnection,
    InitializeRtu,
    ChangeRtuAddress,
    EditLandmarks,
    AssignBaseRef,
    DefineTrace,
    AttachTrace,
    DetachTrace,
    AttachBop,
    RemoveBop,
    ChangeMonitoringSettings,
    DoPreciseMonitoringOutOfOrder,
    DoMeasurementClient,
    RemoveRtu,
    CleanTrace,
    RemoveTrace,

    ChangeMeasurementStatus
}
