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

    CheckRtuConnection,
    InitializeRtu,
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
}
