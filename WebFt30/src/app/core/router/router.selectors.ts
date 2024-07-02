import { createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

import { selectRouterState } from '../core.state';
import { RouterStateUrl } from './router.state';

const selectRouter = createSelector(
  selectRouterState,
  (state: RouterReducerState<RouterStateUrl>) => state
);

const selectRouterStateUrl = createSelector(
  selectRouter,
  (state: RouterReducerState<RouterStateUrl>) => state?.state
);

const selectRouterData = createSelector(
  selectRouter,
  (state: RouterReducerState<RouterStateUrl>) => state?.state?.data
);

const selectRouterDoesNotHaveNavigationToParent = createSelector(
  selectRouterStateUrl,
  (state: RouterStateUrl) => state?.data?.navigateToParent === undefined
);

const selectOcmPortIndexParam = createSelector(
  selectRouter,
  (state: RouterReducerState<RouterStateUrl>) => {
    const params = state?.state?.params;
    // return +params['ocmPortIndex'];
    return params['ocmPortIndex'] ? +params['ocmPortIndex'] : null;
  }
);

const selectHasOcmPortIndexParam = createSelector(
  selectRouter,
  (state: RouterReducerState<RouterStateUrl>) => {
    const params = state?.state?.params;
    return params['ocmPortIndex'] !== undefined;
  }
);

const selectMonitoringPortIdParam = createSelector(
  selectRouter,
  (state: RouterReducerState<RouterStateUrl>) => {
    const params = state?.state?.params;
    return params['monitoringPortId'] ? +params['monitoringPortId'] : null;
  }
);

export const selectHideMonitoringsAvailableActions = createSelector(
  selectRouter,
  (routerState: RouterReducerState<RouterStateUrl>) => {
    if (!routerState || !routerState.state) {
      return false;
    }

    const url = routerState.state.url;
    const pattern = /^\/rfts-setup\/monitoring\/ports\/\d+\/dashboard\/\d+$/;
    return pattern.test(url);
  }
);

export const RouterSelectors = {
  selectRouter,
  selectRouterStateUrl,
  selectRouterData,
  selectOcmPortIndexParam,
  selectHasOcmPortIndexParam,
  selectMonitoringPortIdParam,
  selectHideMonitoringsAvailableActions,
  selectRouterDoesNotHaveNavigationToParent
};
