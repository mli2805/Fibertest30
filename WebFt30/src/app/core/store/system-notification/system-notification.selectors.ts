import { createSelector } from '@ngrx/store';
import { SystemNotificationStateAdapter } from './system-notification.reducer';
import { selectSystemNotificationState } from '../../core.state';
import { SystemNotificationState } from './system-notification.state';
import { RouterSelectors } from '../../router/router.selectors';
import { RouterStateUrl } from '../../router/router.state';

const { selectIds, selectEntities, selectAll, selectTotal } =
  SystemNotificationStateAdapter.getSelectors();

const selectSystemNotification = createSelector(
  selectSystemNotificationState,
  (state: SystemNotificationState) => state
);

const selectSystemNotificationNotifications = createSelector(selectSystemNotification, selectAll);

const selectTotalCount = createSelector(selectSystemNotification, selectTotal);

export const SystemNotificationSelectors = {
  selectSystemNotification,
  selectSystemNotificationNotifications,
  selectTotalCount
};
