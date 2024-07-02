import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AlarmEventsActions } from './alarm-events.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { ReportingService } from '../../grpc/services/reporting.service';
import { Injectable } from '@angular/core';
import { MapUtils } from '../../map.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';

@Injectable()
export class AlarmEventsEffects {
  getAlarmEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmEventsActions.getAlarmEvents),
      switchMap(({ monitoringPortIds }) => {
        return this.reportingService.getAlarmEvents(monitoringPortIds).pipe(
          map((response) => {
            return AlarmEventsActions.getAlarmEventsSuccess({
              alarmEvents: MapUtils.toAlarmEvents(response.alarmEvents)
            });
          }),
          catchError((error) =>
            of(
              AlarmEventsActions.getAlarmEventsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        );
      })
    )
  );

  constructor(private actions$: Actions, private reportingService: ReportingService) {}
}
