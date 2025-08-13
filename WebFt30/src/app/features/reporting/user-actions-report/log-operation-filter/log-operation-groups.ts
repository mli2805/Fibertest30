import { LogOperationCode } from 'src/app/core/store/models/ft30/user-action-line';

interface LogOperationOption {
  code: LogOperationCode;
  labelKey: string;
  selected: boolean;
}

interface LogOperationGroup {
  title?: string;
  options: LogOperationOption[];
}

export const logOperationGroups: LogOperationGroup[] = [
  {
    title: 'Client',
    options: [
      {
        code: LogOperationCode.ClientStarted,
        labelKey: 'i18n.ft.client-started',
        selected: true
      },
      { code: LogOperationCode.ClientExited, labelKey: 'i18n.ft.client-exited', selected: true },
      {
        code: LogOperationCode.ClientConnectionLost,
        labelKey: 'i18n.ft.client-connection-lost',
        selected: true
      },
      {
        code: LogOperationCode.UsersMachineKeyAssigned,
        labelKey: 'i18n.ft.users-machine-key-assigned',
        selected: true
      }
    ]
  },
  {
    title: 'RTU',
    options: [
      { code: LogOperationCode.RtuAdded, labelKey: 'i18n.ft.rtu-added', selected: true },
      { code: LogOperationCode.RtuUpdated, labelKey: 'i18n.ft.rtu-updated', selected: true },
      {
        code: LogOperationCode.RtuInitialized,
        labelKey: 'i18n.ft.rtu-initialized',
        selected: true
      },
      { code: LogOperationCode.RtuRemoved, labelKey: 'i18n.ft.rtu-removed', selected: true }
      // {
      //   code: LogOperationCode.RtuAddressCleared,
      //   labelKey: 'i18n.ft.rtu-address-cleared',
      //   selected: true
      // }
    ]
  },
  {
    title: 'Trace',
    options: [
      { code: LogOperationCode.TraceAdded, labelKey: 'i18n.ft.trace-added', selected: true },
      { code: LogOperationCode.TraceUpdated, labelKey: 'i18n.ft.trace-updated', selected: true },
      {
        code: LogOperationCode.TraceAttached,
        labelKey: 'i18n.ft.trace-attached',
        selected: true
      },
      {
        code: LogOperationCode.TraceDetached,
        labelKey: 'i18n.ft.trace-detached',
        selected: true
      },
      { code: LogOperationCode.TraceCleaned, labelKey: 'i18n.ft.trace-cleaned', selected: true },
      { code: LogOperationCode.TraceRemoved, labelKey: 'i18n.ft.trace-removed', selected: true },
      {
        code: LogOperationCode.BaseRefAssigned,
        labelKey: 'i18n.ft.base-ref-assigned',
        selected: true
      }
    ]
  },
  {
    title: 'TCE',
    options: [
      { code: LogOperationCode.TceAdded, labelKey: 'i18n.ft.tce-added', selected: true },
      { code: LogOperationCode.TceUpdated, labelKey: 'i18n.ft.tce-updated', selected: true },
      { code: LogOperationCode.TceRemoved, labelKey: 'i18n.ft.tce-removed', selected: true }
    ]
  },
  {
    title: 'Monitoring',
    options: [
      {
        code: LogOperationCode.MonitoringSettingsChanged,
        labelKey: 'i18n.ft.monitoring-settings-changed',
        selected: true
      },
      {
        code: LogOperationCode.MonitoringStarted,
        labelKey: 'i18n.ft.monitoring-started',
        selected: true
      },
      {
        code: LogOperationCode.MonitoringStopped,
        labelKey: 'i18n.ft.monitoring-stopped',
        selected: true
      },
      {
        code: LogOperationCode.MeasurementUpdated,
        labelKey: 'i18n.ft.measurement-updated',
        selected: true
      }
    ]
  },
  {
    title: 'Other',
    options: [
      {
        code: LogOperationCode.EventsAndSorsRemoved,
        labelKey: 'i18n.ft.events-and-sors-removed',
        selected: true
      },
      { code: LogOperationCode.SnapshotMade, labelKey: 'i18n.ft.snapshot-made', selected: true }
    ]
  }
];
