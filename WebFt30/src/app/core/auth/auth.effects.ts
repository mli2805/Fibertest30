import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, delay, finalize, map, switchMap, tap } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { IdentityService } from 'src/app/core/grpc';
import { GlobalUiActions } from '../store/global-ui/global-ui.actions';
import { AuthActions } from './auth.actions';
import { MapUtils } from '../map.utils';
import { WindowRefService } from '../services';
import { AppState } from '../core.state';
import { GrpcUtils } from '../grpc/grpc.utils';

@Injectable()
export class AuthEffects {
  login = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(() => this.store.dispatch(GlobalUiActions.showInitialLoading())),
      switchMap(({ username, password }) =>
        this.identityService.login(username, password).pipe(
          map((result) => {
            if (!result.allow) {
              return AuthActions.loginFailure({ error: 'i18n.error.invalid-username-or-password' });
            } else {
              const token = result.token;
              const user = MapUtils.toUser(result.user!);
              const settings = MapUtils.toUserSettings(result.settings);
              return AuthActions.loginSuccess({ token, user, settings });
            }
          }),
          catchError((error) => {
            return of(AuthActions.loginFailure({ error: GrpcUtils.toServerError(error) }));
          }),
          finalize(() => this.store.dispatch(GlobalUiActions.hideLoading()))
        )
      )
    )
  );

  loginSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, user }) => {
          this.localStorageService.setAuth(token);
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap((x) => {
          this.localStorageService.removeAuth();

          // this.router.navigate(['/login']);

          this.windowRef.removeAuthAndReload();
        })
      ),
    { dispatch: false }
  );

  refreshTokenFailure = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenFailure),
        tap(({ error }) => {
          this.windowRef.removeAuthAndReload();
        })
      ),
    { dispatch: false }
  );

  refreshToken = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.identityService.refreshToken().pipe(
          map((result) => {
            const token = result.token;
            return AuthActions.refreshTokenSuccess({ token });
          }),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({ error: GrpcUtils.toServerError(error) }))
          )
        )
      )
    )
  );

  refreshTokenSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        tap(({ token }) => {
          this.localStorageService.setAuth(token);
        })
      ),
    { dispatch: false }
  );

  loadCurrentUser = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      tap(() => this.store.dispatch(GlobalUiActions.showInitialLoading())),
      switchMap(() =>
        this.identityService.getCurrentUser().pipe(
          map((response) => {
            const user = MapUtils.toUser(response.user!);
            const settings = MapUtils.toUserSettings(response.settings);
            return AuthActions.loadCurrentUserSuccess({ user, settings });
          }),
          catchError((error) =>
            of(AuthActions.loadCurrentUserFailure({ error: GrpcUtils.toServerError(error) }))
          ),
          finalize(() => this.store.dispatch(GlobalUiActions.hideLoading()))
        )
      )
    )
  );

  loadCurrentUserFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUserFailure),
      map(({ error }) => GlobalUiActions.showError({ error }))
    )
  );

  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private router: Router,
    private store: Store<AppState>,
    private identityService: IdentityService,
    private windowRef: WindowRefService
  ) {}
}
