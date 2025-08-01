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
  getOpticalEvent = createEffect(() =>
    this.actions$.pipe(
      ofType(OpticalEventsActions.getOpticalEvent),
      switchMap(({ eventId }) => {
        return this.eventTablesService.getOpticalEvent(eventId).pipe(
          map((response) => {
            return OpticalEventsActions.getOpticalEventSuccess({
              opticalEvent: EventTablesMapping.toOpticalEvent(response.opticalEvent!)
            });
          }),
          catchError((error) => {
            return of(
              OpticalEventsActions.getOpticalEventFailure({
                errorMessageId: 'i18n.ft.cant-get-optical-event'
              })
            );
          })
        );
      })
    )
  );

  getOpticalEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(OpticalEventsActions.getOpticalEvents),
      switchMap(({ currentEvents, orderDescending, searchWindow }) => {
        return this.eventTablesService
          .getOpticalEvents(currentEvents, searchWindow, null, orderDescending)
          .pipe(
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
          );
      })
    )
  );

  loadNextOpticalEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(OpticalEventsActions.loadNextOpticalEvents),
      switchMap(({ currentEvents, orderDescending, lastLoaded, searchWindow }) => {
        return this.eventTablesService
          .getOpticalEvents(currentEvents, searchWindow, lastLoaded, orderDescending)
          .pipe(
            map((response) => {
              return OpticalEventsActions.loadNextOpticalEventsSuccess({
                opticalEvents: EventTablesMapping.toOpticalEvents(response.opticalEvents)
              });
            }),
            catchError((error) =>
              of(
                OpticalEventsActions.loadNextOpticalEventsFailure({
                  error: GrpcUtils.toServerError(error)
                })
              )
            )
          );
      })
    )
  );

  constructor(private actions$: Actions, private eventTablesService: EventTablesService) {}
}
