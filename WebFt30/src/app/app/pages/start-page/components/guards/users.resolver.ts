import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { AppState } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { Actions } from '@ngrx/effects';
import { UsersActions } from 'src/app/core/store/users/users.actions';
import { UsersSelectors } from 'src/app/core/store/users/users.selectors';

@Injectable({ providedIn: 'root' })
export class UsersResolver {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(): Observable<any> {
    const loaded = CoreUtils.getCurrentState(this.store, UsersSelectors.selectLoaded);
    if (loaded) {
      return of(null);
    }

    return CoreUtils.dispatchAndWaitObservable(
      this.store,
      this.actions$,
      UsersActions.getUsers(),
      UsersActions.getUsersSuccess,
      UsersActions.getUsersFailure
    );
  }
}
