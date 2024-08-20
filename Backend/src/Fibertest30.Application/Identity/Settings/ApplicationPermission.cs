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
    AssignBaseRef,
    DoPreciseMonitoringOutOfOrder,
    DoMeasurementClient,
}
