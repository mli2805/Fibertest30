import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import {
  catchError,
  delay,
  map,
  switchMap,
  tap,
  finalize,
  exhaustMap,
  filter,
  withLatestFrom
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { of, EMPTY } from 'rxjs';

import { MeasurementService } from '../../grpc/services/measurement.service';
import { OnDemandActions } from './on-demand.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { MapUtils } from '../../map.utils';
import { FileSaverService } from '../../services';
import { OnDemandSelectors } from './on-demand.selectors';
import { AppState } from '../../core.state';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { ReportingService } from '../../grpc';

@Injectable()
export class OnDemandEffects {
  startOnDemand = createEffect(() =>
    this.actions$.pipe(
      ofType(OnDemandActions.startOnDemand),
      exhaustMap(({ monitoringPortId, measurementSettings }) => {
        return this.measurementService.startOnDemand(monitoringPortId, measurementSettings).pipe(
          map(({ onDemandId }) => {
            return GlobalUiActions.dummyAction();
            // OnDemandActions.startOnDemandSuccess is dispatched from server messages
            // to sync user on-demand opened in different browsers
            // return OnDemandActions.startOnDemandSuccess({ onDemandId });
          }),
          catchError((error) => {
            return of(
              OnDemandActions.startOnDemandFailure({ error: GrpcUtils.toServerError(error) })
            );
          })
        );
      })
    )
  );

  stopOnDemand = createEffect(() =>
    this.actions$.pipe(
      ofType(OnDemandActions.stopOnDemand),
      // delay(3000),
      exhaustMap(({ otdrTaskId }) =>
        this.measurementService.stopOnDemand(otdrTaskId).pipe(
          map(() => {
            return OnDemandActions.stopOnDemandSuccess();
          }),
          catchError((error) =>
            of(OnDemandActions.stopOnDemandFailure({ error: GrpcUtils.toServerError(error) }))
          )
        )
      )
    )
  );

  saveTrace = createEffect(() =>
    this.actions$.pipe(
      ofType(OnDemandActions.saveTrace),
      exhaustMap(({ onDemandId, monitoringPortId, at }) =>
        this.reportingService.getOnDemandTrace(onDemandId, false).pipe(
          map(({ sor }) => OnDemandActions.saveTraceSuccess({ monitoringPortId, at, sor })),
          catchError((error) =>
            of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: 'i18n.completed-on-demand.cant-load-on-demand-trace'
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
        ofType(OnDemandActions.saveTraceSuccess),
        map(({ sor, monitoringPortId, at }) => {
          const name = this.fileSaver.getSorFileName('on-demand', monitoringPortId, at);
          this.fileSaver.saveAs(sor, name);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private measurementService: MeasurementService,
    private reportingService: ReportingService,
    private fileSaver: FileSaverService
  ) {}
}
