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
      switchMap(({ landmarksModelId, traceId }) => {
        return this.landmarksService.createLandmarksModel(landmarksModelId, traceId).pipe(
          switchMap(() => {
            return this.landmarksService.getLandmarksModel(landmarksModelId).pipe(
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

  updateLandmarksModel = createEffect(() =>
    this.actions$.pipe(
      ofType(LandmarksModelsActions.updateLandmarksModel),
      switchMap(({ landmarksModelId, changedLandmark, isFilterOn }) => {
        return this.landmarksService
          .updateLandmarksModel(landmarksModelId, changedLandmark, isFilterOn)
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
                      errorMessageId: 'failed to fetch updated landmarks model'
                    })
                  )
                )
              );
            }),
            catchError((error) => {
              return of(
                LandmarksModelsActions.updateLandmarksModelFailure({
                  errorMessageId: 'failed to update landmarks model'
                })
              );
            })
          );
      })
    )
  );

  deleteLandmarksModel = createEffect(() =>
    this.actions$.pipe(
      ofType(LandmarksModelsActions.deleteLandmarksModel),
      switchMap(({ landmarksModelId }) => {
        return this.landmarksService.deleteLandmarksModel(landmarksModelId).pipe(
          map((response) => {
            return LandmarksModelsActions.deleteLandmarksModelSuccess({ landmarksModelId });
          }),
          catchError((error) => {
            return of(
              LandmarksModelsActions.deleteLandmarksModelFailure({
                errorMessageId: 'failed to delete model'
              })
            );
          })
        );
      })
    )
  );

  cancelOneLandmarkChanges = createEffect(() =>
    this.actions$.pipe(
      ofType(LandmarksModelsActions.cancelOneLandmarkChanges),
      switchMap(({ landmarksModelId, row }) => {
        return this.landmarksService.cancelOneLandmarkChanges(landmarksModelId, row).pipe(
          switchMap(() => {
            return this.landmarksService.getLandmarksModel(landmarksModelId).pipe(
              map((response) =>
                LandmarksModelsActions.getLandmarksModelSuccess({
                  landmarksModel: LandmarksMapping.fromGrpcLandmarksModel(response.landmarksModel!)
                })
              ),
              catchError(() =>
                of(
                  LandmarksModelsActions.getLandmarksModelFailure({
                    errorMessageId: 'failed to fetch landmarks model'
                  })
                )
              )
            );
          }),
          catchError((error) => {
            return of(
              LandmarksModelsActions.cancelOneLandmarkChangesFailure({
                errorMessageId: 'failed to cancel one landmark changes'
              })
            );
          })
        );
      })
    )
  );

  clearLandmarksModel = createEffect(() =>
    this.actions$.pipe(
      ofType(LandmarksModelsActions.clearLandmarksModel),
      switchMap(({ landmarksModelId }) => {
        return this.landmarksService.clearLandmarksModel(landmarksModelId).pipe(
          switchMap(() => {
            return this.landmarksService.getLandmarksModel(landmarksModelId).pipe(
              map((response) =>
                LandmarksModelsActions.getLandmarksModelSuccess({
                  landmarksModel: LandmarksMapping.fromGrpcLandmarksModel(response.landmarksModel!)
                })
              ),
              catchError(() =>
                of(
                  LandmarksModelsActions.getLandmarksModelFailure({
                    errorMessageId: 'failed to fetch cleared landmarks model'
                  })
                )
              )
            );
          }),
          catchError((error) => {
            return of(
              LandmarksModelsActions.clearLandmarksModelFailure({
                errorMessageId: 'failed to clear landmarks model'
              })
            );
          })
        );
      })
    )
  );

  applyLandmarkChanges = createEffect(() =>
    this.actions$.pipe(
      ofType(LandmarksModelsActions.applyLandmarkChanges),
      switchMap(({ landmarksModelIds }) => {
        return this.landmarksService.applyLandmarkChanges(landmarksModelIds).pipe(
          switchMap(() => {
            return this.landmarksService.getLandmarksModel(landmarksModelIds[0]).pipe(
              map((response) =>
                LandmarksModelsActions.getLandmarksModelSuccess({
                  landmarksModel: LandmarksMapping.fromGrpcLandmarksModel(response.landmarksModel!)
                })
              ),
              catchError(() =>
                of(
                  LandmarksModelsActions.getLandmarksModelFailure({
                    errorMessageId: 'failed to fetch landmarks model'
                  })
                )
              )
            );
          }),
          catchError((error) => {
            return of(
              LandmarksModelsActions.applyLandmarkChangesFailure({
                errorMessageId: 'failed to apply landmark changes'
              })
            );
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private landmarksService: LandmarksService) {}
}
