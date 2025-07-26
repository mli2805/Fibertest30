import { createAction, props } from '@ngrx/store';
import { NetAddress } from '../models/ft30/net-address';
import { InitializeRtuDto } from '../models/ft30/initialize-rtu-dto';
import { RtuInitializedDto } from '../models/ft30/rtu-initialized-dto';
import { DoMeasurementClientDto } from '../models/ft30/do-measurement-client-dto';
import { ApplyMonitoringSettingsDto } from '../models/ft30/apply-monitorig-settings-dto';
import { RequestAnswer } from '../models/ft30/request-answer';
import { DoPreciseMeasurementOutOfTurnDto } from '../models/ft30/do-precise-measurement-out-of-turn-dto';

const testMainChannel = createAction(
  '[RtuMgmt] Test Main Channel',
  props<{ netAddress: NetAddress }>()
);

const testMainChannelSuccess = createAction(
  '[RtuMgmt] Test Main Channel Success',
  // команда проверить выполнена успешно, а результат м.б. Нет соединения
  props<{ netAddress: NetAddress | undefined; isConnectionSuccessful: boolean }>()
);

const testMainChannelFailure = createAction(
  '[RtuMgmt] Test Main Channel Failure',
  // ошибка во время выполнения команды
  props<{ errorMessageId: string }>()
);

const testReserveChannel = createAction(
  '[RtuMgmt] Test Reserve Channel',
  props<{ netAddress: NetAddress }>()
);

const testReserveChannelSuccess = createAction(
  '[RtuMgmt] Test Reserve Channel Success',
  // команда проверить выполнена успешно, а результат м.б. Нет соединения
  props<{ netAddress: NetAddress | undefined; isConnectionSuccessful: boolean }>()
);

const testReserveChannelFailure = createAction(
  '[RtuMgmt] Test Reserve Channel Failure',
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

const startPreciseMeasurementOutOfTurn = createAction(
  '[RtuMgmt] Start Precise Measurement Out Of Turn ',
  props<{ dto: DoPreciseMeasurementOutOfTurnDto }>()
);
const startPreciseMeasurementOutOfTurnSuccess = createAction(
  '[RtuMgmt] Start Precise Measurement Out Of Turn  Success'
);
const startPreciseMeasurementOutOfTurnFailure = createAction(
  '[RtuMgmt] Start Precise Measurement Out Of Turn  Failure',
  props<{ errorMessageId: string }>()
);

const measurementClientDone = createAction(
  '[RtuMgmt] Measurement Client Done',
  props<{ measurementClientId: string }>()
);
const getMeasurementClientSorSuccess = createAction('[RtuMgmt] Get Measurement Client Success');

const preciseMeasurementOutOfTurnDone = createAction(
  '[RtuMgmt] Precise Measurement Out Of Turn Done',
  props<{ outOfTurnSorFileId: number }>()
);

const stopMonitoring = createAction('[RtuMgmt] Stop Monitoring', props<{ rtuId: string }>());
const stopMonitoringSuccess = createAction('[RtuMgmt] Stop Monitoring Success');
const stopMonitoringFailure = createAction(
  '[RtuMgmt] Stop Monitoring Failure',
  props<{ errorMessageId: string }>()
);

const interruptMeasurement = createAction(
  '[RtuMgmt] Interrupt Measurement',
  props<{ rtuId: string }>()
);
const interruptMeasurementSuccess = createAction('[RtuMgmt] Interrupt Measurement Success');
const interruptMeasurementFailure = createAction(
  '[RtuMgmt] Interrupt Measurement Failure',
  props<{ errorMessageId: string }>()
);

const applyMonitoringSettings = createAction(
  '[RtuMgmt] Apply Monitoring Settings',
  props<{ dto: ApplyMonitoringSettingsDto }>()
);
const applyMonitoringSettingsSuccess = createAction(
  '[RtuMgmt] Apply Monitoring Settings Success',
  props<{ dto: RequestAnswer | undefined }>()
);
const applyMonitoringSettingsFailure = createAction(
  '[RtuMgmt] Apply Monitoring Settings Failure',
  props<{ errorMessageId: string }>()
);

const reset = createAction('[RtuMgmt] Reset');
const cleanMeasurementClient = createAction('[RtuMgmt] Clean Measurement Client');
const setSpinner = createAction('[RtuMgmt] Set Spinner', props<{ value: boolean }>());

export const RtuMgmtActions = {
  testMainChannel,
  testMainChannelSuccess,
  testMainChannelFailure,

  testReserveChannel,
  testReserveChannelSuccess,
  testReserveChannelFailure,

  initializeRtu,
  initializeRtuSuccess,
  initializeRtuFailure,

  startMeasurementClient,
  startMeasurementClientSuccess,
  startMeasurementClientFailure,

  startPreciseMeasurementOutOfTurn,
  startPreciseMeasurementOutOfTurnSuccess,
  startPreciseMeasurementOutOfTurnFailure,

  measurementClientDone,
  getMeasurementClientSorSuccess,
  cleanMeasurementClient,

  preciseMeasurementOutOfTurnDone,

  stopMonitoring,
  stopMonitoringSuccess,
  stopMonitoringFailure,

  interruptMeasurement,
  interruptMeasurementSuccess,
  interruptMeasurementFailure,

  applyMonitoringSettings,
  applyMonitoringSettingsSuccess,
  applyMonitoringSettingsFailure,

  reset,
  setSpinner
};
