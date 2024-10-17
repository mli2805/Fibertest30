import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { EventTablesService } from '../../grpc';
import { of } from 'rxjs';
import { BopEventsActions } from './bop-events.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { EventTablesMapping } from '../mapping/event-tables-mapping';

@Injectable()
export class BopEventsEffects {
  getBopEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(BopEventsActions.getBopEvents),
      switchMap(({ currentEvents }) =>
        this.eventTablesService.getBopEvents(currentEvents).pipe(
          map((response) => {
            return BopEventsActions.getBopEventsSuccess({
              bopEvents: EventTablesMapping.toBopEvents(response.bopEvents)
            });
          }),
          catchError((error) =>
            of(
              BopEventsActions.getBopEventsFailure({
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
