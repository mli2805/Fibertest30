import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, mergeMap } from 'rxjs';
import { MapUtils } from '../../map.utils';
import { NetworkSettingsActions } from './network-settings.action';
import { MeasurementService } from '../../grpc/services/measurement.service';
import { GlobalUiActions } from '../global-ui/global-ui.actions';

@Injectable()
export class NetworkSettingsEffects {
  refreshNetworkSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkSettingsActions.refreshNetworkSettings),
      switchMap(() => {
        return this.measurementService.refreshNetworkSettings().pipe(
          map((response) => {
            const settings = MapUtils.toNetworkSettings(response.networkSettings!);
            return NetworkSettingsActions.refreshNetworkSettingsSuccess({ settings });
          }),
          catchError((error) => {
            return of(
              NetworkSettingsActions.refreshNetworkSettingsFailure({
                errorMessageId: 'i18n.network-settings.cant-refresh-network-settings'
              })
            );
          })
        );
      })
    )
  );

  updateNetworkSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkSettingsActions.updateNetworkSettings),
      switchMap(({ settings }) => {
        const grpcSettings = MapUtils.toGrpcNetworkSettings(settings);
        return this.measurementService.updateNetworkSettings(grpcSettings).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            return of(
              NetworkSettingsActions.updateNetworkSettingsFailure({
                errorMessageId: 'i18n.network-settings.cant-update-network-settings'
              })
            );
          })
        );
      })
    )
  );

  updateNetworkSettingsSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkSettingsActions.updateNetworkSettingsSuccess),
      mergeMap(() => {
        return of(NetworkSettingsActions.refreshNetworkSettings());
      })
    )
  );

  constructor(private actions$: Actions, private measurementService: MeasurementService) {}
}
