import { createEntityAdapter } from '@ngrx/entity';
import { SystemNotificationState } from './system-notification.state';
import { createReducer, on } from '@ngrx/store';
import { SystemNotification } from '../models';
import { SystemNotificationActions } from './system-notification.actions';
import { OnDemandActions } from '../on-demand/on-demand.actions';

export const SystemNotificationStateAdapter = createEntityAdapter<SystemNotification>({
  selectId: (systemNotification: SystemNotification) => systemNotification.systemEvent.id,
  sortComparer: (a: SystemNotification, b: SystemNotification) =>
    b.systemEvent.id - a.systemEvent.id
});

export const initialState: SystemNotificationState = SystemNotificationStateAdapter.getInitialState(
  {
    showOnDemandNotification: false
  }
);

const reducer = createReducer(
  initialState,
  on(SystemNotificationActions.getNotificationsSuccess, (state, { systemNotifications }) => {
    return SystemNotificationStateAdapter.addMany(systemNotifications, state);
  }),
  on(SystemNotificationActions.addNotification, (state, { systemNotification }) => {
    systemNotification.isNew = true;
    return SystemNotificationStateAdapter.addOne(systemNotification, state);
  }),
  on(SystemNotificationActions.dismissNotificationSuccess, (state, { systemEventId }) => {
    return SystemNotificationStateAdapter.removeOne(systemEventId, state);
  }),
  on(
    SystemNotificationActions.dismissNotificationsByLevelSuccess,
    (state, { systemEventLevel }) => {
      return SystemNotificationStateAdapter.removeMany(
        (x) => x.systemEvent.level === systemEventLevel,
        state
      );
    }
  ),
  on(SystemNotificationActions.dismissAllNotificationsSuccess, (state) => {
    return SystemNotificationStateAdapter.removeAll(state);
  }),
  on(SystemNotificationActions.setNotificationSeen, (state, { systemEventId }) => {
    const notification = state.entities[systemEventId];
    if (notification) {
      const updatedNotification = { ...notification, isNew: false };
      return SystemNotificationStateAdapter.updateOne(
        {
          id: systemEventId,
          changes: updatedNotification
        },
        state
      );
    }

    return state;
  }),
  on(OnDemandActions.startOnDemandSuccess, (state) => ({
    ...state,
    showOnDemandNotification: true
  })),
  on(SystemNotificationActions.hideOnDemandNotification, (state) => ({
    ...state,
    showOnDemandNotification: false
  }))
);

export function systemNotificationReducer(
  state: SystemNotificationState | undefined,
  action: any
): SystemNotificationState {
  return reducer(state, action);
}
