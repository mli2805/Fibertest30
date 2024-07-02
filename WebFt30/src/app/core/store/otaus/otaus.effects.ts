import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { MapUtils } from '../../map.utils';
import { CoreService } from '../../grpc/services/core.service';
import { OtausActions } from './otaus.actions';
import { GlobalUiActions } from '../global-ui/global-ui.actions';

@Injectable()
export class OtausEffects {
  constructor(private actions$: Actions, private coreService: CoreService) {}

  updateOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.updateOtau),
      switchMap(({ otauId, patch }) => {
        const grpcPatch = MapUtils.toGrpcOtauPatch(patch);
        return this.coreService.updateOtau(otauId, grpcPatch).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            const errorMessageId = 'i18n.error.cant-update-otau';
            return of(OtausActions.updateOtauFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  updateOtauSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.updateOtauSuccess),
      mergeMap(({ otauId }) => {
        return of(OtausActions.getOtau({ otauId }));
      })
    )
  );

  getOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.getOtau),
      switchMap(({ otauId }) => {
        return this.coreService.getOtau(otauId).pipe(
          map((response) => {
            return OtausActions.getOtauSuccess({ otau: MapUtils.toOtau(response.otau!) });
          }),
          catchError((error) => {
            return of(
              OtausActions.getOtauFailure({ errorMessageId: 'i18n.error.cant-refresh-otau' })
            );
          })
        );
      })
    )
  );

  getCreatedOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.getCreatedOtau),
      switchMap(({ otauId }) => {
        return this.coreService.getOtau(otauId).pipe(
          map((response) => {
            return OtausActions.getCreatedOtauSuccess({ otau: MapUtils.toOtau(response.otau!) });
          }),
          catchError((error) => {
            return of(
              OtausActions.getCreatedOtauFailure({
                errorMessageId: 'i18n.error.cant-get-created-otau'
              })
            );
          })
        );
      })
    )
  );

  removeOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.removeOtau),
      switchMap(({ otauId }) => {
        return this.coreService.removeOtau(otauId).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            const errorMessageId = 'i18n.error.cant-remove-otau';
            return of(OtausActions.removeOtauFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  addOsmOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.addOsmOtau),
      switchMap(({ ocmPortIndex, chainAddress }) => {
        return this.coreService.addOsmOtau(ocmPortIndex, chainAddress).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            const errorMessageId = 'i18n.error.cant-add-osm-otau';
            return of(OtausActions.addOtauFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  addOxcOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.addOxcOtau),
      switchMap(({ ocmPortIndex, ipAddress, port }) => {
        return this.coreService.addOxcOtau(ocmPortIndex, ipAddress, port).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            const errorMessageId = 'i18n.error.cant-add-oxc-otau';
            return of(OtausActions.addOtauFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  addOtauSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(OtausActions.addOtauSuccess),
      mergeMap(({ otauId }) => {
        return of(OtausActions.getCreatedOtau({ otauId }));
      })
    )
  );
}
