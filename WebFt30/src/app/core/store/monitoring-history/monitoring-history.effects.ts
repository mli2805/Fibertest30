import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, exhaustMap, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { ReportingService } from '../../grpc';
import { MapUtils } from '../../map.utils';
import { of } from 'rxjs';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { Router } from '@angular/router';
import { MonitoringHistoryActions } from './monitoring-history.actions';
import { FileSaverService } from '../../services';
import { GlobalUiActions } from '../global-ui/global-ui.actions';

@Injectable()
export class MonitoringHistoryEffects {
  getMonitorings = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringHistoryActions.getMonitorings),
      switchMap(({ monitoringPortIds, orderDescending }) => {
        return this.reportingService.getMonitorings(null, monitoringPortIds, orderDescending).pipe(
          map((response) => {
            return MonitoringHistoryActions.getMonitoringsSuccess({
              monitorings: MapUtils.toMonitoringResults(response.monitorings)
            });
          }),
          catchError((error) =>
            of(
              MonitoringHistoryActions.getMonitoringsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        );
      })
    )
  );

  loadNextMonitorings = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringHistoryActions.loadNextMonitorings),
      switchMap(({ lastMonitoringDateTime, monitoringPortIds, orderDescending }) => {
        return this.reportingService
          .getMonitorings(lastMonitoringDateTime, monitoringPortIds, orderDescending)
          .pipe(
            map((response) => {
              return MonitoringHistoryActions.loadNextMonitoringsSuccess({
                monitorings: MapUtils.toMonitoringResults(response.monitorings)
              });
            }),
            catchError((error) =>
              of(
                MonitoringHistoryActions.loadNextMonitoringsFailure({
                  error: GrpcUtils.toServerError(error)
                })
              )
            )
          );
      })
    )
  );

  saveTrace = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringHistoryActions.saveTrace),
      exhaustMap(({ monitoringId, monitoringPortId, at }) =>
        this.reportingService.getMonitoringTrace(monitoringId, false).pipe(
          map(({ sor }) =>
            MonitoringHistoryActions.saveTraceSuccess({ monitoringPortId, at, sor })
          ),
          catchError((error) =>
            of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: 'i18n.monitoring-result.cant-load-monitoring-trace'
              })
            )
          )
        )
      )
    )
  );

  saveTraceSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MonitoringHistoryActions.saveTraceSuccess),
        map(({ monitoringPortId, at, sor }) => {
          const name = this.fileSaver.getSorFileName('monitoring', monitoringPortId, at);
          this.fileSaver.saveAs(sor, name);
        })
      ),
    { dispatch: false }
  );

  saveTraceAndBase = createEffect(() =>
    this.actions$.pipe(
      ofType(MonitoringHistoryActions.saveTraceAndBase),
      exhaustMap(({ monitoringId, monitoringPortId, at }) =>
        this.reportingService.getMonitoringTraceAndBase(monitoringId).pipe(
          map(({ archive }) =>
            MonitoringHistoryActions.saveTraceAndBaseSuccess({ monitoringPortId, at, archive })
          ),
          catchError((error) =>
            of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: 'i18n.monitoring-result.cant-load-monitoring-trace'
              })
            )
          )
        )
      )
    )
  );

  saveTraceAndBaseSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MonitoringHistoryActions.saveTraceAndBaseSuccess),
        map(({ monitoringPortId, at, archive }) => {
          const name = this.fileSaver.getSorFileName('monitoring', monitoringPortId, at, 'zip');
          this.fileSaver.saveAs(archive, name);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private reportingService: ReportingService,
    private fileSaver: FileSaverService
  ) {}
}
