import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LandmarksModelsActions } from './landmarks-models.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../core.state';
import { catchError, map, of, switchMap } from 'rxjs';
import { LandmarksMapping } from '../mapping/landmarks-mapping';
import { LandmarksService } from '../../grpc/services/landmarks.service';

@Injectable()
export class LandmarksModelsEffects {
  createLandmarksModel = createEffect(() =>
    this.actions$.pipe(
      ofType(LandmarksModelsActions.createLandmarksModel),
      switchMap(({ landmarksModelId, traceId, gpsInputMode }) => {
        return this.landmarksService
          .createLandmarksModel(landmarksModelId, traceId, gpsInputMode)
          .pipe(
            switchMap(() => {
              return this.landmarksService.getLandmarksModel(landmarksModelId).pipe(
                map((response) =>
                  LandmarksModelsActions.getLandmarksModelSuccess({
                    landmarksModel: LandmarksMapping.fromGrpcLandmarksModel(
                      response.landmarksModel!
                    )
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
    private landmarksService: LandmarksService,
    private store: Store<AppState>
  ) {}
}
