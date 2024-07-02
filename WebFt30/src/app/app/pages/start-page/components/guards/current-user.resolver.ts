import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, race, take } from 'rxjs';

import { AppState, AuthSelectors, AuthActions } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { Actions, ofType } from '@ngrx/effects';

// We need this resolver to load user details after the page was refreshed
@Injectable({ providedIn: 'root' })
export class CurrentUserResolver {
  constructor(private store: Store<AppState>, private actions$: Actions, private router: Router) {}

  resolve(): Observable<any> {
    const user = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
    if (user) {
      return of(null);
    }

    const result = CoreUtils.dispatchAndWaitObservable(
      this.store,
      this.actions$,
      AuthActions.loadCurrentUser(),
      AuthActions.loadCurrentUserSuccess,
      AuthActions.loadCurrentUserFailure
    );

    return result;
  }
}
