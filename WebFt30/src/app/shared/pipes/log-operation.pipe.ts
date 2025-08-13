import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { LogOperationCode } from 'src/app/core/store/models/ft30/user-action-line';

@Injectable({ providedIn: 'root' })
@Pipe({ name: 'logOperationCodePipe' })
export class LogOperationCodePipe implements PipeTransform {
  transform(value: LogOperationCode): string {
    switch (value) {
      case LogOperationCode.ClientStarted:
        return 'i18n.ft.client-started';
      case LogOperationCode.ClientExited:
        return 'i18n.ft.client-exited';
      case LogOperationCode.ClientConnectionLost:
        return 'i18n.ft.client-connection-lost';
      case LogOperationCode.UsersMachineKeyAssigned:
        return 'i18n.ft.users-machine-key-assigned';

      case LogOperationCode.RtuAdded:
        return 'i18n.ft.rtu-added';
      case LogOperationCode.RtuUpdated:
        return 'i18n.ft.rtu-updated';
      case LogOperationCode.RtuInitialized:
        return 'i18n.ft.rtu-initialized';
      case LogOperationCode.RtuRemoved:
        return 'i18n.ft.rtu-removed';
      case LogOperationCode.RtuAddressCleared:
        return 'i18n.ft.rtu-address-cleared';

      case LogOperationCode.TraceAdded:
        return 'i18n.ft.trace-added';
      case LogOperationCode.TraceUpdated:
        return 'i18n.ft.trace-updated';
      case LogOperationCode.TraceAttached:
        return 'i18n.ft.trace-attached';
      case LogOperationCode.TraceDetached:
        return 'i18n.ft.trace-detached';
      case LogOperationCode.TraceCleaned:
        return 'i18n.ft.trace-cleaned';
      case LogOperationCode.TraceRemoved:
        return 'i18n.ft.trace-removed';

      case LogOperationCode.TceAdded:
        return 'i18n.ft.tce-added';
      case LogOperationCode.TceUpdated:
        return 'i18n.ft.tce-updated';
      case LogOperationCode.TceRemoved:
        return 'i18n.ft.tce-removed';

      case LogOperationCode.BaseRefAssigned:
        return 'i18n.ft.base-ref-assigned';
      case LogOperationCode.MonitoringSettingsChanged:
        return 'i18n.ft.monitoring-settings-changed';
      case LogOperationCode.MonitoringStarted:
        return 'i18n.ft.monitoring-started';
      case LogOperationCode.MonitoringStopped:
        return 'i18n.ft.monitoring-stopped';

      case LogOperationCode.MeasurementUpdated:
        return 'i18n.ft.measurement-updated';

      case LogOperationCode.EventsAndSorsRemoved:
        return 'i18n.ft.events-and-sors-removed';
      case LogOperationCode.SnapshotMade:
        return 'i18n.ft.snapshot-made';

      default:
        return 'i18n.ft.unknown';
    }
  }
}
