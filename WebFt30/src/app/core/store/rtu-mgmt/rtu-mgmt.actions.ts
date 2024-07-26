import { createAction, props } from '@ngrx/store';
import { NetAddress } from '../models/ft30/net-address';
import { DoubleAddress } from '../models/ft30/double-address';
import { InitializeRtuDto } from '../models/ft30/initialize-rtu-dto';
import { RtuInitializedDto } from '../models/ft30/rtu-initialized-dto';

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

export const RtuMgmtActions = {
  testRtuConnection,
  testRtuConnectionSuccess,
  testRtuConnectionFailure,

  initializeRtu,
  initializeRtuSuccess,
  initializeRtuFailure
};
