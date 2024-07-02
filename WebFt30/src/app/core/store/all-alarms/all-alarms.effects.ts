import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { MapUtils } from '../../map.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { AllAlarmsActions } from './all-alarms.actions';
import { ReportingService } from '../../grpc';

@Injectable()
export class AllAlarmsEffects {
  getAllAlarms = createEffect(() =>
    this.actions$.pipe(
      ofType(AllAlarmsActions.getAllAlarms),
      switchMap(({ monitoringPortIds }) => {
        return this.reportingService.getAllAlarms(monitoringPortIds).pipe(
          map((response) => {
            return AllAlarmsActions.getAllAlarmsSuccess({
              allAlarms: MapUtils.toAlarms(response.allAlarms)
            });
          }),
          catchError((error) =>
            of(
              AllAlarmsActions.getAllAlarmsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        );
      })
    )
  );

  getAllAlarmsFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(AllAlarmsActions.getAllAlarmsFailure),
      map(({ error }) =>
        GlobalUiActions.showPopupError({
          popupErrorMessageId: 'i18n.all-alarms.cant-load-all-alarms'
        })
      )
    )
  );

  constructor(private actions$: Actions, private reportingService: ReportingService) {}
}
