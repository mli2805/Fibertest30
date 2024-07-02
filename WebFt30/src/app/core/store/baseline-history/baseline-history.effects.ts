import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BaselineHistoryActions } from './baseline-history.actions';
import { ReportingService } from '../../grpc/services/reporting.service';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { MapUtils } from '../../map.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { GlobalUiEffects } from '../global-ui/global-ui.effects';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { FileSaverService } from '../../services';

@Injectable()
export class BaselineHistoryEffects {
  getBaselines = createEffect(() =>
    this.actions$.pipe(
      ofType(BaselineHistoryActions.getBaselines),
      switchMap(({ monitoringPortIds }) => {
        return this.reportingService.getBaselines(monitoringPortIds).pipe(
          map((response) => {
            return BaselineHistoryActions.getBaselinesSuccess({
              baselines: MapUtils.toMonitoringBaselines(response.baselines)
            });
          }),
          catchError((error) =>
            of(
              BaselineHistoryActions.getBaselinesFailure({ error: GrpcUtils.toServerError(error) })
            )
          )
        );
      })
    )
  );

  saveBase = createEffect(() =>
    this.actions$.pipe(
      ofType(BaselineHistoryActions.saveBase),
      exhaustMap(({ baselineId, monitoringPortId, at }) =>
        this.reportingService.getBaselineTrace(baselineId, false).pipe(
          map(({ sor }) => BaselineHistoryActions.saveBaseSuccess({ monitoringPortId, at, sor })),
          catchError((error) =>
            of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: 'i18n.monitoring-result.cant-load-baseline-trace'
              })
            )
          )
        )
      )
    )
  );

  saveBaseSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BaselineHistoryActions.saveBaseSuccess),
        map(({ monitoringPortId, at, sor }) => {
          const name = this.fileSaver.getSorFileName('baseline', monitoringPortId, at);
          this.fileSaver.saveAs(sor, name);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private reportingService: ReportingService,
    private fileSaver: FileSaverService
  ) {}
}
