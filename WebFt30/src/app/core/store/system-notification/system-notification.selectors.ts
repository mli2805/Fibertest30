import { createSelector } from '@ngrx/store';
import { SystemNotificationStateAdapter } from './system-notification.reducer';
import { selectSystemNotificationState } from '../../core.state';
import { SystemNotificationState } from './system-notification.state';
import { OnDemandSelectors } from '../on-demand/on-demand.selectors';
import { OnDemandState } from '../on-demand/on-demand.state';
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

const selectShowOnDemandNotification = createSelector(
  selectSystemNotification,
  OnDemandSelectors.selectOnDemand,
  RouterSelectors.selectRouterStateUrl,
  OnDemandSelectors.selectCancelled,

  (
    state: SystemNotificationState,
    onDemandState: OnDemandState,
    routeStateUrl: RouterStateUrl,
    cancelled: boolean
  ) =>
    state.showOnDemandNotification &&
    onDemandState.otdrTask?.otdrTaskId !== null &&
    !cancelled &&
    routeStateUrl?.url !== '/on-demand'
);

export const SystemNotificationSelectors = {
  selectSystemNotification,
  selectSystemNotificationNotifications,
  selectTotalCount,
  selectShowOnDemandNotification
};
