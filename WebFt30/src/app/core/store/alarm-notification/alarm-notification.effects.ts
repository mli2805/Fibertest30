import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../core.state';
import { CoreService } from '../../grpc/services/core.service';
import { AlarmNotificationActions } from './alarm-notification.actions';
import {
  catchError,
  combineLatest,
  exhaustMap,
  filter,
  finalize,
  map,
  of,
  switchMap,
  delay,
  tap,
  withLatestFrom
} from 'rxjs';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { MapUtils } from '../../map.utils';
import { AlarmNotification } from '../models';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { RouterSelectors } from '../../router/router.selectors';

@Injectable()
export class AlarmNotificationEffects {
  routerStateUrl$ = this.store.select(RouterSelectors.selectRouterStateUrl);

  getNotifications = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmNotificationActions.getNotifications),
      // tap(() => this.store.dispatch(GlobalUiActions.showLoading())),
      switchMap(() =>
        this.coreService.getUserAlarmNotifications().pipe(
          map(({ alarmEvents }) => {
            const alarmNotifications = alarmEvents.map((alarmEvent) => {
              const alarmNotification = new AlarmNotification();
              alarmNotification.alarmEvent = MapUtils.toAlarmEvent(alarmEvent);
              return alarmNotification;
            });

            return AlarmNotificationActions.getNotificationsSuccess({
              alarmNotifications
            });
          }),
          catchError((error) =>
            of(
              AlarmNotificationActions.getNotificationsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
          // finalize(() => this.store.dispatch(GlobalUiActions.hideLoading()))
        )
      )
    )
  );

  dismissNotification = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmNotificationActions.dismissNotification),
      exhaustMap(({ alarmEventId }) =>
        this.coreService.dismissUserAlarmNotification(alarmEventId).pipe(
          map(() => AlarmNotificationActions.dismissNotificationSuccess({ alarmEventId })),
          catchError((error) =>
            of(
              AlarmNotificationActions.commonDismissNotificationFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        )
      )
    )
  );

  dismissNotificationByLevel = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmNotificationActions.dismissNotificationsByLevel),
      exhaustMap(({ alarmLevel }) =>
        this.coreService.dismissUserAlarmNotificationsByLevel(alarmLevel).pipe(
          map(() => AlarmNotificationActions.dismissNotificationsByLevelSuccess({ alarmLevel })),
          catchError((error) =>
            of(
              AlarmNotificationActions.commonDismissNotificationFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        )
      )
    )
  );

  dismissAllNotifications = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmNotificationActions.dismissAllNotifications),
      exhaustMap(() =>
        this.coreService.dismissAllUserAlarmNotifications().pipe(
          map(() => AlarmNotificationActions.dismissAllNotificationsSuccess()),
          catchError((error) =>
            of(
              AlarmNotificationActions.commonDismissNotificationFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        )
      )
    )
  );

  commonDismissNotificationFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmNotificationActions.commonDismissNotificationFailure),
      map(({ error }) =>
        GlobalUiActions.showPopupError({
          popupErrorMessageId: 'i18n.error.cant-dismiss-notification'
        })
      )
    )
  );

  getNotificationsFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmNotificationActions.getNotificationsFailure),
      map(({ error }) => GlobalUiActions.showError({ error }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private coreService: CoreService
  ) {}
}
