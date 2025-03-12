export enum ApplicationPermission {
  ChangeRtuSettings = 'ChangeRtuSettings',
  SetupMonitoringThresholds = 'SetupMonitoringThresholds',
  HandleAlarm = 'HandleAlarm',
  ViewDataLog = 'ViewDataLog',
  ReceiveOpticalNotifications = 'ReceiveOpticalNotifications',
  ReceiveSystemNotifications = 'ReceiveSystemNotifications',
  EditUsers = 'EditUsers',
  ChangeNotificationSettings = 'ChangeNotificationSettings',

  // EditGraph includes changing rtu/trace titles and comments
  EditGraph = 'EditGraph',
  CheckRtuConnection = 'CheckRtuConnection',
  InitializeRtu = 'InitializeRtu',
  ChangeRtuAddress = 'ChangeRtuAddress',
  EditLandmarks = 'EditLandmarks',
  AssignBaseRef = 'AssignBaseRef',
  DefineTrace = 'DefineTrace',
  AttachTrace = 'AttachTrace',
  DetachTrace = 'DetachTrace',
  AttachBop = 'AttachBop',
  RemoveBop = 'RemoveBop',
  ChangeMonitoringSettings = 'ChangeMonitoringSettings',
  DoPreciseMonitoringOutOfOrder = 'DoPreciseMonitoringOutOfOrder',
  DoMeasurementClient = 'DoMeasurementClient',
  RemoveRtu = 'RemoveRtu',
  CleanTrace = 'CleanTrace',
  RemoveTrace = 'RemoveTrace'
}
