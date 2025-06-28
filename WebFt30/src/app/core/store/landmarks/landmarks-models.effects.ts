import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LandmarksModelsActions } from './landmarks-models.actions';
import { GisService } from '../../grpc/services/gis.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core.state';
import { catchError, map, of, switchMap } from 'rxjs';
import { LandmarksMapping } from '../mapping/landmarks-mapping';

@Injectable()
export class LandmarksModelsEffects {
  createLandmarksModel = createEffect(() =>
    this.actions$.pipe(
      ofType(LandmarksModelsActions.createLandmarksModel),
      switchMap(({ landmarksModelId, traceId, gpsInputMode }) => {
        return this.gisService.createLandmarksModel(landmarksModelId, traceId, gpsInputMode).pipe(
          switchMap(() => {
            return this.gisService.getLandmarksModel(landmarksModelId).pipe(
              map((response) =>
                LandmarksModelsActions.getLandmarksModelSuccess({
                  landmarksModel: LandmarksMapping.fromGrpcLandmarksModel(response.landmarksModel!)
                })
              ),
              catchError(() =>
                of(
                  LandmarksModelsActions.getLandmarksModelFailure({
                    errorMessageId: 'failed to fetch created landmarks model'
                  })
                )
              )
            );
          }),
          catchError((error) => {
            return of(
              LandmarksModelsActions.createLandmarksModelFailure({
                errorMessageId: 'failed to create landmarks model'
              })
            );
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private gisService: GisService,
    private store: Store<AppState>
  ) {}
}
