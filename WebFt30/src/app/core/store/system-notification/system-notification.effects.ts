import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../core.state';
import { CoreService } from '../../grpc/services/core.service';
import { SystemNotificationActions } from './system-notification.actions';
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
import { SystemNotification } from '../models';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { OnDemandSelectors } from '../on-demand/on-demand.selectors';
import { RouterSelectors } from '../../router/router.selectors';

@Injectable()
export class SystemNotificationEffects {
  onDemandCompleted$ = this.store.select(OnDemandSelectors.selectCompleted);
  routerStateUrl$ = this.store.select(RouterSelectors.selectRouterStateUrl);

  getNotifications = createEffect(() =>
    this.actions$.pipe(
      ofType(SystemNotificationActions.getNotifications),
      // tap(() => this.store.dispatch(GlobalUiActions.showLoading())),
      switchMap(() =>
        this.coreService.getUserSystemNotifications().pipe(
          map(({ systemEvents }) => {
            const systemNotifications = systemEvents.map((systemEvent) => {
              const systemNotification = new SystemNotification();
              systemNotification.systemEvent = MapUtils.toSystemEvent(systemEvent);
              return systemNotification;
            });

            return SystemNotificationActions.getNotificationsSuccess({
              systemNotifications
            });
          }),
          catchError((error) =>
            of(
              SystemNotificationActions.getNotificationsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          ),
          finalize(() => this.store.dispatch(GlobalUiActions.hideLoading()))
        )
      )
    )
  );

  dismissNotification = createEffect(() =>
    this.actions$.pipe(
      ofType(SystemNotificationActions.dismissNotification),
      exhaustMap(({ systemEventId }) =>
        this.coreService.dismissUserSystemNotification(systemEventId).pipe(
          map(() => SystemNotificationActions.dismissNotificationSuccess({ systemEventId })),
          catchError((error) =>
            of(
              SystemNotificationActions.commonDismissNotificationFailure({
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
      ofType(SystemNotificationActions.dismissNotificationsByLevel),
      exhaustMap(({ systemEventLevel }) =>
        this.coreService.dismissUserSystemNotificationsByLevel(systemEventLevel).pipe(
          map(() =>
            SystemNotificationActions.dismissNotificationsByLevelSuccess({ systemEventLevel })
          ),
          catchError((error) =>
            of(
              SystemNotificationActions.commonDismissNotificationFailure({
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
      ofType(SystemNotificationActions.dismissAllNotifications),
      exhaustMap(() =>
        this.coreService.dismissAllUserSystemNotifications().pipe(
          map(() => SystemNotificationActions.dismissAllNotificationsSuccess()),
          catchError((error) =>
            of(
              SystemNotificationActions.commonDismissNotificationFailure({
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
      ofType(SystemNotificationActions.commonDismissNotificationFailure),
      map(({ error }) =>
        GlobalUiActions.showPopupError({
          popupErrorMessageId: 'i18n.error.cant-dismiss-notification'
        })
      )
    )
  );

  getNotificationsFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(SystemNotificationActions.getNotificationsFailure),
      map(({ error }) => GlobalUiActions.showError({ error }))
    )
  );

  // The idea is not to show On-Demand completed notification if user is on /on-demand page
  // or hide the notification when user navigates to the on-demand page
  hideOnDemandNotification$ = createEffect(() =>
    combineLatest([this.onDemandCompleted$, this.routerStateUrl$]).pipe(
      filter(
        ([onDemandCompleted, routerStateUrl]) =>
          onDemandCompleted && routerStateUrl?.url === '/on-demand'
      ),
      map(() => SystemNotificationActions.hideOnDemandNotification())
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private coreService: CoreService
  ) {}
}
