import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { AppState, RolesActions, RolesSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';

@Injectable({ providedIn: 'root' })
export class RolesResolver {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(): Observable<any> {
    const loaded = CoreUtils.getCurrentState(this.store, RolesSelectors.selectLoaded);
    if (loaded) {
      return of(null);
    }

    return CoreUtils.dispatchAndWaitObservable(
      this.store,
      this.actions$,
      RolesActions.getRoles(),
      RolesActions.getRolesSuccess,
      RolesActions.getRolesFailure
    );
  }
}
