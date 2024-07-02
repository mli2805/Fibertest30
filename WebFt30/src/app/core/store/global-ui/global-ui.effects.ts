import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap, tap } from 'rxjs';

import { GlobalUiActions } from './global-ui.actions';
import { Router } from '@angular/router';

@Injectable()
export class GlobalUiEffects {
  showError = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GlobalUiActions.showError),
        tap(({ error }) => {
          this.router.navigate(['/error']);
        })
      ),
    { dispatch: false }
  );

  showPopupError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GlobalUiActions.showPopupError),
      switchMap(() => of(GlobalUiActions.timeoutPopupError()).pipe(delay(3000)))
    )
  );

  timeoutPopupError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GlobalUiActions.timeoutPopupError),
      map(() => GlobalUiActions.hidePopupError())
    )
  );

  constructor(private actions$: Actions, private router: Router) {}
}
