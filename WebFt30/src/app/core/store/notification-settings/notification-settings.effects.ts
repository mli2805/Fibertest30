import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationSettingsActions } from './notification-settings.action';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { MapUtils } from '../../map.utils';
import { FtSettingsService } from '../../grpc/services/ft-settings.service';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { CoreUtils } from '../../core.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';

@Injectable()
export class NotificationSettingsEffects {
  testEmailServerSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationSettingsActions.testEmailServerSettings),
      switchMap(({ emailServer }) => {
        const grpcEmailserver = MapUtils.toGrpcEmailServer(emailServer);
        return this.ftSettingsService.testEmailServerSettings(grpcEmailserver).pipe(
          map((response) => {
            return NotificationSettingsActions.testEmailServerSettingsSuccess();
          }),
          catchError((error) => {
            const errorId = CoreUtils.commonErrorToMessageId(
              GrpcUtils.toServerError(error),
              'i18n.error.cant-test-email-configuration'
            );
            const errorId2 =
              errorId !== null ? errorId : 'i18n.error.cant-test-email-configuration';
            return of(
              NotificationSettingsActions.testEmailServerSettingsFailure({
                errorMessageId: errorId2
              })
            );
          })
        );
      })
    )
  );
  testTrapReceiverSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationSettingsActions.testTrapReceiverSettings),
      switchMap(({ trapReceiver }) => {
        const grpcTrapReceiver = MapUtils.toGrpcTrapReceiver(trapReceiver);
        return this.ftSettingsService.testTrapReceiverSettins(grpcTrapReceiver).pipe(
          map((response) => {
            return NotificationSettingsActions.testTrapReceiverSettingsSuccess();
          }),
          catchError((error) => {
            const errorId = CoreUtils.commonErrorToMessageId(
              GrpcUtils.toServerError(error),
              'i18n.error.cant-test-snmp-configuration'
            );
            const errorId2 = errorId !== null ? errorId : 'i18n.error.cant-test-snmp-configuration';
            return of(
              NotificationSettingsActions.testTrapReceiverSettingsFailure({
                errorMessageId: errorId2
              })
            );
          })
        );
      })
    )
  );

  updateNotificationSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationSettingsActions.updateNotificationSettings),
      switchMap(({ settings }) => {
        const grpcSettings = MapUtils.toGrpcNotificationSettings(settings);
        return this.ftSettingsService.updateNotificationSettings(grpcSettings).pipe(
          map((response) => {
            return GlobalUiActions.dummyAction();
          }),
          catchError((error) => {
            console.log(error);
            return of(
              NotificationSettingsActions.updateNotificationSettingsFailure({
                errorMessageId: 'i18n.notification-settings.cant-update-notification-settings'
              })
            );
          })
        );
      })
    )
  );

  updateNotificationSettingsSuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationSettingsActions.updateNotificationSettingsSuccess),
      mergeMap(() => {
        return of(NotificationSettingsActions.refreshNotificationSettings());
      })
    )
  );

  refreshNotificationSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationSettingsActions.refreshNotificationSettings),
      switchMap(() => {
        return this.ftSettingsService.refreshNotificationSettings().pipe(
          map((response) => {
            const settings = MapUtils.toNotificationSettings(response.notificationSettings!);
            return NotificationSettingsActions.refreshNotificationSettingsSuccess({ settings });
          }),
          catchError((error) => {
            return of(
              NotificationSettingsActions.refreshNotificationSettingsFailure({
                errorMessageId: 'i18n.notification-settings.cant-refresh-notification-settings'
              })
            );
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private ftSettingsService: FtSettingsService) {}
}
