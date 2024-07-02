import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../core.state';
import { catchError, map, of, switchMap, mergeMap } from 'rxjs';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { MapUtils } from '../../map.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { RouterSelectors } from '../../router/router.selectors';
import { ActiveAlarmsActions } from './active-alarms.actions';
import { ReportingService } from '../../grpc';
import { AlarmNotificationActions } from '../alarm-notification/alarm-notification.actions';

@Injectable()
export class ActiveAlarmsEffects {
  routerStateUrl$ = this.store.select(RouterSelectors.selectRouterStateUrl);

  // getActiveAlarms = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ActiveAlarmsActions.getActiveAlarms),
  //     // tap(() => this.store.dispatch(GlobalUiActions.showLoading())),
  //     switchMap(() =>
  //       this.reportingService.getActiveAlarms().pipe(
  //         // delay(2000),
  //         map((response) => {
  //           return ActiveAlarmsActions.getActiveAlarmsSuccess({
  //             activeAlarms: MapUtils.toAlarms(response.activeAlarms)
  //           });
  //         }),
  //         catchError((error) =>
  //           of(
  //             ActiveAlarmsActions.getActiveAlarmsFailure({
  //               error: GrpcUtils.toServerError(error)
  //             })
  //           )
  //         )
  //         // finalize(() => this.store.dispatch(GlobalUiActions.hideLoading()))
  //       )
  //     )
  //   )
  // );

  // getActiveAlarmsFailure = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ActiveAlarmsActions.getActiveAlarmsFailure),
  //     map(({ error }) =>
  //       GlobalUiActions.showPopupError({
  //         popupErrorMessageId: 'i18n.active-alarms.cant-load-active-alarms'
  //       })
  //     )
  //   )
  // );

  addOrUpdateAlarm = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiveAlarmsActions.addOrUpdateAlarm),
      mergeMap(({ id }) =>
        this.reportingService.getAlarm(id).pipe(
          map((response) =>
            ActiveAlarmsActions.addOrUpdateAlarmSuccess({
              alarm: MapUtils.toAlarm(response.alarm!)
            })
          ),
          catchError((error) =>
            of(
              ActiveAlarmsActions.addOrUpdateAlarmFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        )
      )
    )
  );

  addOrUpdateAlarmFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiveAlarmsActions.addOrUpdateAlarmFailure),
      map(({ error }) =>
        GlobalUiActions.showPopupError({
          popupErrorMessageId: 'i18n.active-alarms.cant-load-alarm'
        })
      )
    )
  );

  addNotification = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmNotificationActions.addNotification),
      map(({ alarmNotification }) =>
        ActiveAlarmsActions.addOrUpdateAlarm({
          id: alarmNotification.alarmEvent.monitoringAlarmId
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private reportingService: ReportingService
  ) {}
}
