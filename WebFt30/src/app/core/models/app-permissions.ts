export enum ApplicationPermission {
  ChangeRtuSettings = 'ChangeRtuSettings',
  SetupMonitoringThresholds = 'SetupMonitoringThresholds',
  HandleAlarm = 'HandleAlarm',
  ViewDataLog = 'ViewDataLog',
  ReceiveOpticalNotifications = 'ReceiveOpticalNotifications',
  ReceiveSystemNotifications = 'ReceiveSystemNotifications',
  EditUsers = 'EditUsers',
  ChangeNotificationSettings = 'ChangeNotificationSettings',

  CheckRtuConnection = 'CheckRtuConnection',
  InitializeRtu = 'InitializeRtu',
  AssignBaseRef = 'AssignBaseRef',
  DoPreciseMonitoringOutOfOrder = 'DoPreciseMonitoringOutOfOrder',
  DoMeasurementClient = 'DoMeasurementClient'
}
