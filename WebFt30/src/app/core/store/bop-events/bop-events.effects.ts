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
  getBopEvent = createEffect(() =>
    this.actions$.pipe(
      ofType(BopEventsActions.getBopEvent),
      switchMap(({ eventId }) => {
        return this.eventTablesService.getBopEvent(eventId).pipe(
          map((response) => {
            return BopEventsActions.getBopEventSuccess({
              bopEvent: EventTablesMapping.toBopEvent(response.bopEvent!)
            });
          }),
          catchError((error) =>
            of(
              BopEventsActions.getBopEventsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        );
      })
    )
  );

  getBopEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(BopEventsActions.getBopEvents),
      switchMap(({ currentEvents, orderDescending, searchWindow }) =>
        this.eventTablesService
          .getBopEvents(currentEvents, searchWindow, null, orderDescending)
          .pipe(
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

  loadNextBopEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(BopEventsActions.loadNextBopEvents),
      switchMap(({ currentEvents, orderDescending, lastLoaded, searchWindow }) =>
        this.eventTablesService
          .getBopEvents(currentEvents, searchWindow, lastLoaded, orderDescending)
          .pipe(
            map((response) => {
              return BopEventsActions.loadNextBopEventsSuccess({
                bopEvents: EventTablesMapping.toBopEvents(response.bopEvents)
              });
            }),
            catchError((error) =>
              of(
                BopEventsActions.loadNextBopEventsFailure({
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
