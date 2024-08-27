import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { EventTablesService } from '../../grpc';
import { MapUtils } from '../../map.utils';
import { of } from 'rxjs';
import { SystemEventsActions } from './system-events.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';

@Injectable()
export class SystemEventsEffects {
  getSystemEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(SystemEventsActions.getSystemEvents),
      switchMap(() =>
        this.eventTablesService.getSystemEvents().pipe(
          map((response) => {
            return SystemEventsActions.getSystemEventsSuccess({
              systemEvents: MapUtils.toSystemEvents(response.systemEvents)
            });
          }),
          catchError((error) =>
            of(
              SystemEventsActions.getSystemEventsFailure({ error: GrpcUtils.toServerError(error) })
            )
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private eventTablesService: EventTablesService) {}
}
