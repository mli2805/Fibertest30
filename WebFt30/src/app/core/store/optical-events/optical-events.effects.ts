import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { EventTablesService } from '../../grpc';
import { of } from 'rxjs';
import { OpticalEventsActions } from './optical-events.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { EventTablesMapping } from '../mapping/event-tables-mapping';

@Injectable()
export class OpticalEventsEffects {
  getOpticalEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(OpticalEventsActions.getOpticalEvents),
      switchMap(({ currentEvents }) =>
        this.eventTablesService.getOpticalEvents(currentEvents).pipe(
          map((response) => {
            return OpticalEventsActions.getOpticalEventsSuccess({
              opticalEvents: EventTablesMapping.toOpticalEvents(response.opticalEvents)
            });
          }),
          catchError((error) =>
            of(
              OpticalEventsActions.getOpticalEventsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private eventTablesService: EventTablesService) {}
}
