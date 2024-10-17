import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { EventTablesService } from '../../grpc';
import { of } from 'rxjs';
import { RtuAccidentsActions } from './rtu-accidents.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { EventTablesMapping } from '../mapping/event-tables-mapping';

@Injectable()
export class RtuAccidentsEffects {
  getRtuAccidents = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuAccidentsActions.getRtuAccidents),
      switchMap(({ currentAccidents }) =>
        this.eventTablesService.getRtuAccidents(currentAccidents).pipe(
          map((response) => {
            return RtuAccidentsActions.getRtuAccidentsSuccess({
              rtuAccidents: EventTablesMapping.toRtuAccidents(response.rtuAccidents)
            });
          }),
          catchError((error) =>
            of(
              RtuAccidentsActions.getRtuAccidentsFailure({
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
