import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { CoreUtils } from '../core/core.utils';
import { inject } from '@angular/core';
import { AppState, AuthSelectors } from '../core';
import { Store } from '@ngrx/store';

export const canActivateOnDemandPage: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const hasOnDemandPermission = CoreUtils.getCurrentState(
    inject(Store<AppState>),
    AuthSelectors.selectHasOnDemandPermission
  );

  if (!hasOnDemandPermission) {
    inject(Router).navigate(['/']);
    return false;
  }

  return true;
};
