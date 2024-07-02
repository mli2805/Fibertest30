import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { MeasurementService, ReportingService } from '../../grpc';
import { BaselineSetupActions } from './baseline-setup.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { MonitoringPortActions } from '../monitoring/monitoring-port.actions';
import { FileSaverService } from '../../services';

@Injectable()
export class BaselineSetupEffects {
  constructor(
    private actions$: Actions,
    private measurementService: MeasurementService,
    private reportingService: ReportingService,
    private fileSaver: FileSaverService
  ) {}

  startBaselineSetup = createEffect(() =>
    this.actions$.pipe(
      ofType(BaselineSetupActions.startBaseline),
      switchMap(({ monitoringPortId, fullAutoMode, measurementSettings }) => {
        return this.measurementService
          .startBaselineSetup(monitoringPortId, fullAutoMode, measurementSettings)
          .pipe(
            map((response) => {
              return GlobalUiActions.dummyAction();
            }),
            catchError((error) => {
              return of(
                BaselineSetupActions.startBaselineFailure({
                  monitoringPortId: monitoringPortId,
                  error: GrpcUtils.toServerError(error)
                })
              );
            })
          );
      })
    )
  );

  stopBaseline = createEffect(() =>
    this.actions$.pipe(
      // delay(3000),
      ofType(BaselineSetupActions.stopBaseline),
      exhaustMap(({ monitoringPortId }) =>
        this.measurementService.stopBaselineSetup(monitoringPortId).pipe(
          map(() => {
            return BaselineSetupActions.stopBaselineSuccess({ monitoringPortId });
          }),
          catchError((error) =>
            of(
              BaselineSetupActions.stopBaselineFailure({
                monitoringPortId,
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        )
      )
    )
  );

  baselineFinishedCompleted = createEffect(() =>
    this.actions$.pipe(
      ofType(BaselineSetupActions.baselineFinished),
      filter(({ progress }) => progress.status === 'completed'),
      mergeMap(({ monitoringPortId }) => {
        return of(
          // dispatch autoBaselineSet to clear baselineSetup state for this port
          BaselineSetupActions.clearBaselineSetup({ monitoringPortId }),
          MonitoringPortActions.updatePortGetPort({ monitoringPortId })
        );
      })
    )
  );

  baselineFinishedCancelled = createEffect(() =>
    this.actions$.pipe(
      ofType(BaselineSetupActions.baselineFinished),
      filter(({ progress }) => progress.status === 'cancelled'),
      mergeMap(({ monitoringPortId }) => {
        return of(BaselineSetupActions.clearBaselineSetup({ monitoringPortId }));
      })
    )
  );

  saveTrace = createEffect(() =>
    this.actions$.pipe(
      ofType(BaselineSetupActions.saveTrace),
      exhaustMap(({ baselineId, monitoringPortId, at }) =>
        this.reportingService.getBaselineTrace(baselineId, false).pipe(
          map(({ sor }) => BaselineSetupActions.saveTraceSuccess({ monitoringPortId, at, sor })),
          catchError((error) =>
            of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: 'i18n.baseline.cant-load-baseline-trace'
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
        ofType(BaselineSetupActions.saveTraceSuccess),
        map(({ monitoringPortId, at, sor }) => {
          const name = this.fileSaver.getSorFileName('baseline', monitoringPortId, at);
          this.fileSaver.saveAs(sor, name);
        })
      ),
    { dispatch: false }
  );
}
