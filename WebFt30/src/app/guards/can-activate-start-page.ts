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
import { StartPageResolver } from '../app/pages/start-page/components/guards';

export const canActivateStartPage: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const isAuthenticated = CoreUtils.getCurrentState(
    inject(Store<AppState>),
    AuthSelectors.selectIsAuthenticated
  );

  if (!isAuthenticated) {
    inject(Router).navigate(['/login']);
    return false;
  }

  // resolvers are called after canActivates (child canActivate is called beofre parent's resolver)
  // we need to load user permissions, so other children canActivates can check them (for example canActivateOnDemandPage)
  await inject(StartPageResolver).resolve();

  return true;
};
