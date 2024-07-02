import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, mergeMap } from 'rxjs';
import { MapUtils } from '../../map.utils';
import { MeasurementService } from '../../grpc/services/measurement.service';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { TimeSettingsActions } from './time-settings.action';

@Injectable()
export class TimeSettingsEffects {
  refreshTimeSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSettingsActions.refreshTimeSettings),
      switchMap(() => {
        return this.measurementService.refreshTimeSettings().pipe(
          map((response) => {
            const settings = MapUtils.toTimeSettings(response.timeSettings!);
            return TimeSettingsActions.refreshTimeSettingsSuccess({ settings });
          }),
          catchError((error) => {
            return of(
              TimeSettingsActions.refreshTimeSettingsFailure({
                errorMessageId: 'i18n.time-settings.cant-refresh-time-settings'
              })
            );
          })
        );
      })
    )
  );

  updateTimeSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSettingsActions.updateTimeSettings),
      switchMap(({ settings }) => {
        const grpcSettings = MapUtils.toGrpcTimeSettings(settings);
        return this.measurementService.updateTimeSettings(grpcSettings).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            return of(
              TimeSettingsActions.updateTimeSettingsFailure({
                errorMessageId: 'i18n.time-settings.cant-update-time-settings'
              })
            );
          })
        );
      })
    )
  );

  updateTimeSettingsSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSettingsActions.updateTimeSettingsSuccess),
      mergeMap(() => {
        return of(TimeSettingsActions.refreshTimeSettings());
      })
    )
  );

  constructor(private actions$: Actions, private measurementService: MeasurementService) {}
}
