import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { Store } from '@ngrx/store';

import { CoreUtils } from '../core/core.utils';
import { GlobalUiSelectors } from '../core/store/global-ui/global-ui.selectors';
import { AppState } from '../core/core.state';

export const canActivateErrorPage: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const error = CoreUtils.getCurrentState(inject(Store<AppState>), GlobalUiSelectors.selectError);
  if (error !== null) {
    return true;
  }

  inject(Router).navigate(['/']);
  return false;
};
