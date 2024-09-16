import { createAction, props } from '@ngrx/store';
import { NetAddress } from '../models/ft30/net-address';
import { InitializeRtuDto } from '../models/ft30/initialize-rtu-dto';
import { RtuInitializedDto } from '../models/ft30/rtu-initialized-dto';
import { DoMeasurementClientDto } from '../models/ft30/do-measurement-client-dto';
import { MonitoringStoppedDto } from '../models/ft30/monitoring-stopped-dto';
import { ApplyMonitoringSettingsDto } from '../models/ft30/apply-monitorig-settings-dto';
import { RequestAnswer } from '../models/ft30/request-answer';

const testRtuConnection = createAction(
  '[RtuMgmt] Test Rtu Connection',
  props<{ netAddress: NetAddress }>()
);
const testRtuConnectionSuccess = createAction(
  '[RtuMgmt] Test Rtu Connection Success',
  // команда проверить выполнена успешно, а результат м.б. Нет соединения
  props<{ netAddress: NetAddress | undefined; isConnectionSuccessful: boolean }>()
);
const testRtuConnectionFailure = createAction(
  '[RtuMgmt] Test Rtu Connection Failure',
  // ошибка во время выполнения команды
  props<{ errorMessageId: string }>()
);

const initializeRtu = createAction('[RtuMgmt] Initialize Rtu', props<{ dto: InitializeRtuDto }>());
const initializeRtuSuccess = createAction(
  '[RtuMgmt] Initialize Rtu Success',
  props<{ dto: RtuInitializedDto | undefined }>()
);
const initializeRtuFailure = createAction(
  '[RtuMgmt] Initialize Rtu Failure',
  props<{ errorMessageId: string }>()
);

const startMeasurementClient = createAction(
  '[RtuMgmt] Start Measurement Client',
  props<{ dto: DoMeasurementClientDto }>()
);
const startMeasurementClientSuccess = createAction('[RtuMgmt] Start Measurement Client Success');
const startMeasurementClientFailure = createAction(
  '[RtuMgmt] Start Measurement Client Failure',
  props<{ errorMessageId: string }>()
);

const measurementClientDone = createAction(
  '[RtuMgmt] Measurement Client Done',
  props<{ measurementClientId: string }>()
);
const getMeasurementClientSorSuccess = createAction('[RtuMgmt] Get Measurement Client Success');

const stopMonitoring = createAction('[RtuMgmt] Stop Monitoring', props<{ rtuId: string }>());
const stopMonitoringSuccess = createAction('[RtuMgmt] Stop Monitoring Success');
const stopMonitoringFailure = createAction(
  '[RtuMgmt] Stop Monitoring Failure',
  props<{ errorMessageId: string }>()
);

const applyMonitoringSettings = createAction(
  '[RtuMgmt] Apply Monitoring Settings',
  props<{ dto: ApplyMonitoringSettingsDto }>()
);
const applyMonitoringSettingsSuccess = createAction(
  '[RtuMgmt] Apply Monitoring Settings Success',
  props<{ dto: RequestAnswer }>()
);
const applyMonitoringSettingsFailure = createAction(
  '[RtuMgmt] Apply Monitoring Settings Failure',
  props<{ errorMessageId: string }>()
);

export const RtuMgmtActions = {
  testRtuConnection,
  testRtuConnectionSuccess,
  testRtuConnectionFailure,

  initializeRtu,
  initializeRtuSuccess,
  initializeRtuFailure,

  startMeasurementClient,
  startMeasurementClientSuccess,
  startMeasurementClientFailure,

  measurementClientDone,
  getMeasurementClientSorSuccess,

  stopMonitoring,
  stopMonitoringSuccess,
  stopMonitoringFailure,

  applyMonitoringSettings,
  applyMonitoringSettingsSuccess,
  applyMonitoringSettingsFailure
};
