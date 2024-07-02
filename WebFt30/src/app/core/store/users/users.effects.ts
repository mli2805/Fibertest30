import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersActions } from './users.actions';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { from, of, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import { IdentityService } from '../../grpc';
import { MapUtils } from '../../map.utils';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { AppState } from '../../core.state';
import { AuthActions } from '../../auth/auth.actions';
import { AuthSelectors } from '../../auth/auth.selectors';

@Injectable()
export class UsersEffects {
  getUsers = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.getUsers),
      switchMap(() =>
        this.identityService.getAllUsers().pipe(
          map((response) => {
            return UsersActions.getUsersSuccess({
              users: MapUtils.toUsers(response.users)
            });
          }),
          catchError((error) =>
            of(UsersActions.getUsersFailure({ errorMessageId: 'i18n.users.cant-load-users' }))
          )
        )
      )
    )
  );

  createUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      switchMap(({ patch }) => {
        const grpcPatch = MapUtils.toGrpcApplicationUserPatch(patch);
        return this.identityService.createUser(grpcPatch).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            return of(
              UsersActions.createUserFailure({ errorMessageId: 'i18n.users.cant-create-user' })
            );
          })
        );
      })
    )
  );

  updateUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap(({ userId, patch, outsidePageCall }) => {
        const grpcPatch = MapUtils.toGrpcApplicationUserPatch(patch);
        return this.identityService.updateUser(userId, grpcPatch).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            const errorMessageId = 'i18n.error.cant-update-user';
            if (outsidePageCall) {
              return from([
                GlobalUiActions.showPopupError({ popupErrorMessageId: errorMessageId }),
                UsersActions.updateUserFailure({ errorMessageId })
              ]);
            } else {
              return of(UsersActions.updateUserFailure({ errorMessageId }));
            }
          })
        );
      })
    )
  );

  deleteUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ userId }) => {
        return this.identityService.deleteUser(userId).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            return of(
              UsersActions.deleteUserFailure({ errorMessageId: 'i18n.users.cant-delete-user' })
            );
          })
        );
      })
    )
  );

  createUserSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUserSuccess),
      mergeMap(({ userId }) => {
        return of(UsersActions.createUserGetUser({ userId }));
      })
    )
  );

  createUserGetUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUserGetUser),
      switchMap(({ userId }) => {
        return this.identityService.getUser(userId).pipe(
          map((response) => {
            return UsersActions.createUserGetUserSuccess({ user: MapUtils.toUser(response.user!) });
          }),
          catchError((error) => {
            return of(
              UsersActions.createUserGetUserFailure({
                errorMessageId: 'i18n.error.cant-refresh-user'
              })
            );
          })
        );
      })
    )
  );

  updateUserSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserSuccess),
      mergeMap(({ userId }) => {
        return of(UsersActions.updateUserGetUser({ userId }));
      })
    )
  );

  updateUserGetUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserGetUser),
      switchMap(({ userId }) => {
        return this.identityService.getUser(userId).pipe(
          map((response) => {
            return UsersActions.updateUserGetUserSuccess({
              user: MapUtils.toUser(response.user!)
            });
          }),
          catchError((error) => {
            return of(
              UsersActions.updateUserGetUserFailure({
                errorMessageId: 'i18n.error.cant-refresh-user'
              })
            );
          })
        );
      })
    )
  );

  // if current user was updated
  updateUserGetUserSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserGetUserSuccess),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      filter(([action, authUser]) => action.user.id === authUser!.id),
      map(([action, _]) => AuthActions.updateCurrentUser({ user: action.user }))
    )
  );

  constructor(
    private actions$: Actions,
    private identityService: IdentityService,
    private store: Store<AppState>
  ) {}
}
