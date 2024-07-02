import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { ReportingService } from '../../grpc';
import { MapUtils } from '../../map.utils';
import { of } from 'rxjs';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { OnDemandHistoryActions } from './on-demand-history.actions';
import { Router } from '@angular/router';

@Injectable()
export class OnDemandHistoryEffects {
  getOnDemands = createEffect(() =>
    this.actions$.pipe(
      ofType(OnDemandHistoryActions.getOnDemands),
      switchMap(({ monitoringPortIds }) =>
        this.reportingService.getOnDemands(monitoringPortIds).pipe(
          map((response) => {
            return OnDemandHistoryActions.getOnDemandsSuccess({
              onDemands: MapUtils.toCompletedOnDemands(response.onDemands)
            });
          }),
          catchError((error) =>
            of(
              OnDemandHistoryActions.getOnDemandsFailure({ error: GrpcUtils.toServerError(error) })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private reportingService: ReportingService
  ) {}
}
