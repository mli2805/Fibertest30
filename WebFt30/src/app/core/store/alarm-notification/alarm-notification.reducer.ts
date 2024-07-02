import { createEntityAdapter } from '@ngrx/entity';
import { AlarmNotificationState } from './alarm-notification.state';
import { createReducer, on } from '@ngrx/store';
import { AlarmNotification } from '../models';
import { AlarmNotificationActions } from './alarm-notification.actions';

export const AlarmNotificationStateAdapter = createEntityAdapter<AlarmNotification>({
  selectId: (alarmNotification: AlarmNotification) => alarmNotification.alarmEvent.id,
  sortComparer: (a: AlarmNotification, b: AlarmNotification) => b.alarmEvent.id - a.alarmEvent.id
});

export const initialState: AlarmNotificationState = AlarmNotificationStateAdapter.getInitialState(
  {}
);

const reducer = createReducer(
  initialState,
  on(AlarmNotificationActions.getNotificationsSuccess, (state, { alarmNotifications }) => {
    return AlarmNotificationStateAdapter.addMany(alarmNotifications, state);
  }),
  on(AlarmNotificationActions.addNotification, (state, { alarmNotification }) => {
    alarmNotification.isNew = true;
    return AlarmNotificationStateAdapter.addOne(alarmNotification, state);
  }),
  on(AlarmNotificationActions.dismissNotificationSuccess, (state, { alarmEventId }) => {
    return AlarmNotificationStateAdapter.removeOne(alarmEventId, state);
  }),
  on(AlarmNotificationActions.dismissNotificationsByLevelSuccess, (state, { alarmLevel }) => {
    return AlarmNotificationStateAdapter.removeMany(
      (x) => x.alarmEvent.level === alarmLevel,
      state
    );
  }),
  on(AlarmNotificationActions.dismissAllNotificationsSuccess, (state) => {
    return AlarmNotificationStateAdapter.removeAll(state);
  }),
  on(AlarmNotificationActions.setNotificationSeen, (state, { alarmEventId }) => {
    const notification = state.entities[alarmEventId];
    if (notification) {
      const updatedNotification = { ...notification, isNew: false };
      return AlarmNotificationStateAdapter.updateOne(
        {
          id: alarmEventId,
          changes: updatedNotification
        },
        state
      );
    }

    return state;
  })
);

export function alarmNotificationReducer(
  state: AlarmNotificationState | undefined,
  action: any
): AlarmNotificationState {
  return reducer(state, action);
}
