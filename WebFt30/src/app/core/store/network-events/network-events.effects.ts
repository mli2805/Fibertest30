import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { EventTablesService } from '../../grpc';
import { of } from 'rxjs';
import { NetworkEventsActions } from './network-events.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { EventTablesMapping } from '../mapping/event-tables-mapping';

@Injectable()
export class NetworkEventsEffects {
  getNetworkEvent = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkEventsActions.getNetworkEvent),
      switchMap(({ eventId }) => {
        return this.eventTablesService.getNetworkEvent(eventId).pipe(
          map((response) => {
            return NetworkEventsActions.getNetworkEventSuccess({
              networkEvent: EventTablesMapping.toNetworkEvent(response.networkEvent!)
            });
          }),
          catchError((error) =>
            of(
              NetworkEventsActions.getNetworkEventsFailure({
                error: GrpcUtils.toServerError(error)
              })
            )
          )
        );
      })
    )
  );

  getNetworkEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkEventsActions.getNetworkEvents),
      switchMap(({ currentEvents, orderDescending, searchWindow }) =>
        this.eventTablesService
          .getNetworkEvents(currentEvents, searchWindow, null, orderDescending)
          .pipe(
            map((response) => {
              return NetworkEventsActions.getNetworkEventsSuccess({
                networkEvents: EventTablesMapping.toNetworkEvents(response.networkEvents)
              });
            }),
            catchError((error) =>
              of(
                NetworkEventsActions.getNetworkEventsFailure({
                  error: GrpcUtils.toServerError(error)
                })
              )
            )
          )
      )
    )
  );

  loadNextNetworkEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkEventsActions.loadNextNetworkEvents),
      switchMap(({ currentEvents, orderDescending, lastLoaded, searchWindow }) =>
        this.eventTablesService
          .getNetworkEvents(currentEvents, searchWindow, lastLoaded, orderDescending)
          .pipe(
            map((response) => {
              return NetworkEventsActions.loadNextNetworkEventsSuccess({
                networkEvents: EventTablesMapping.toNetworkEvents(response.networkEvents)
              });
            }),
            catchError((error) =>
              of(
                NetworkEventsActions.loadNextNetworkEventsFailure({
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
