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
  getNetworkEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkEventsActions.getNetworkEvents),
      switchMap(({ currentEvents }) =>
        this.eventTablesService.getNetworkEvents(currentEvents).pipe(
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

  constructor(private actions$: Actions, private eventTablesService: EventTablesService) {}
}
