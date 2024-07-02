import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AlarmProfilesActions } from './alarm-profiles.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { MeasurementService } from '../../grpc';
import { MapUtils } from '../../map.utils';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { CoreUtils } from '../../core.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';

@Injectable()
export class AlarmProfilesEffects {
  updateAlarmProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmProfilesActions.updateAlarmProfile),
      switchMap(({ profile }) => {
        const grpcProfile = MapUtils.toGrpcAlarmProfile(profile);
        return this.measurementService.updateAlarmProfile(grpcProfile).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            return of(
              AlarmProfilesActions.updateAlarmProfileFailure({
                errorMessageId: 'i18n.alarm-profiles.cant-update-alarm-profile'
              })
            );
          })
        );
      })
    )
  );

  updateAlarmProfileSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmProfilesActions.updateAlarmProfileSuccess),
      mergeMap(({ profileId }) => {
        return of(AlarmProfilesActions.getUpdatedAlarmProfile({ profileId }));
      })
    )
  );

  getUpdatedAlarmProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmProfilesActions.getUpdatedAlarmProfile),
      switchMap(({ profileId }) => {
        return this.measurementService.getAlarmProfile(profileId).pipe(
          map((response) => {
            return AlarmProfilesActions.getUpdatedAlarmProfileSuccess({
              profile: MapUtils.toAlarmProfile(response.alarmProfile!)
            });
          }),
          catchError((error) => {
            return of(
              AlarmProfilesActions.updateAlarmProfileFailure({
                errorMessageId: 'i18n.alarm-profiles.cant-refresh-alarm-profile'
              })
            );
          })
        );
      })
    )
  );

  getCreatedAlarmProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmProfilesActions.getCreatedAlarmProfile),
      switchMap(({ profileId }) => {
        return this.measurementService.getAlarmProfile(profileId).pipe(
          map((response) => {
            return AlarmProfilesActions.getCreatedAlarmProfileSuccess({
              profile: MapUtils.toAlarmProfile(response.alarmProfile!)
            });
          }),
          catchError((error) => {
            return of(
              AlarmProfilesActions.createAlarmProfileFailure({
                errorMessageId: 'i18n.alarm-profiles.cant-create-alarm-profile'
              })
            );
          })
        );
      })
    )
  );

  createAlarmProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmProfilesActions.createAlarmProfile),
      switchMap(({ profile }) => {
        return this.measurementService
          .createAlarmProfile(MapUtils.toGrpcAlarmProfile(profile))
          .pipe(
            map((response) => {
              return GlobalUiActions.dummyAction();
            }),
            catchError((error) => {
              console.log('create alarm profile failed');
              return of(
                AlarmProfilesActions.createAlarmProfileFailure({
                  errorMessageId: 'i18n.alarm-profiles.cant-create-alarm-profile'
                })
              );
            })
          );
      })
    )
  );

  createAlarmProfileSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmProfilesActions.createAlarmProfileSuccess),
      mergeMap(({ profileId }) => {
        return of(AlarmProfilesActions.getCreatedAlarmProfile({ profileId }));
      })
    )
  );

  deleteAlarmProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(AlarmProfilesActions.deleteAlarmProfile),
      switchMap(({ alarmProfileId }) => {
        return this.measurementService.deleteAlarmProfile(alarmProfileId).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            const errorId = CoreUtils.commonErrorToMessageId(
              GrpcUtils.toServerError(error),
              'i18n.alarm-profiles.cant-delete-alarm-profile'
            );
            const errorId2 =
              errorId !== null ? errorId : 'i18n.alarm-profiles.cant-delete-alarm-profile';
            return of(
              AlarmProfilesActions.deleteAlarmProfileFailure({
                errorMessageId: errorId2
              })
            );
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private measurementService: MeasurementService) {}
}
