import { createAction, props } from '@ngrx/store';
import { NetAddress } from '../models/ft30/net-address';

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

export const RtuMgmtActions = {
  testRtuConnection,
  testRtuConnectionSuccess,
  testRtuConnectionFailure
};
