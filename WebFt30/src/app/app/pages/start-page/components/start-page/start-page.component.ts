import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, takeUntil, timer } from 'rxjs';
import {
  AppState,
  AuthActions,
  AuthSelectors,
  BaselineSetupActions,
  BaselineSetupSelectors,
  SystemNotificationActions,
  GlobalUiActions,
  GlobalUiSelectors,
  MonitoringPortActions,
  OnDemandActions,
  OnDemandSelectors,
  OtausActions,
  AlarmNotificationActions,
  OtdrTaskProgress,
  TestQueueSelectors,
  TestQueueActions
} from 'src/app/core';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { CoreService } from 'src/app/core/grpc/services/core.service';
import { MapUtils } from 'src/app/core/map.utils';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { InAppSystemNotification, MonitoringAlarmEvent, SystemEvent } from 'src/grpc-generated';
import { UsersActions } from 'src/app/core/store/users/users.actions';
import { AlarmProfilesActions } from 'src/app/core/store/alarm-profile/alarm-profiles.actions';
import {
  MonitoringPortStatusChangedData,
  MonitoringPortScheduleChangedData,
  MonitoringPortAlarmProfileChangedData,
  OtauAddedData,
  OtauChangedData,
  OtauConnectionStatusChangedData,
  OtauInformationChangedData,
  OtauRemovedData,
  UserChangedData,
  UserCreatedData,
  UserDeletedData,
  AlarmProfileChangedData,
  AlarmProfileCreatedData,
  AlarmProfileDeletedData,
  NotificationSettingsUpdatedData,
  OtdrTaskProgressData
} from 'src/app/shared/system-events/system-event-data';
import { NotificationSettingsActions } from 'src/app/core/store/notification-settings/notification-settings.action';
import { NetworkSettingsActions } from 'src/app/core/store/network-settings/network-settings.action';
import { TimeSettingsActions } from 'src/app/core/store/time-settings/time-settings.action';
import { RtuConnectionCheckedData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/rtu-connection-checked-data';

@Component({
  selector: 'rtu-start-page',
  templateUrl: 'start-page.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class StartPageComponent extends OnDestroyBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('header', { read: ElementRef }) headerElementRef!: ElementRef;
  headerHeight = 0;

  selectShowSystemNotifications$ = this.store.select(
    GlobalUiSelectors.selectShowSystemNotification
  );
  selectShowAlarmNotifications$ = this.store.select(GlobalUiSelectors.selectShowAlarmNotification);

  popupErrorMessageId$ = this.store.select(GlobalUiSelectors.selectPopupErrorMessageId);

  private refreshTokenIntervalId: any = null;

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private coreService: CoreService
  ) {
    super();
  }

  async ngOnInit() {
    await this.refreshTokenAtOnceAndRefreshPeriodically();
    await this.getUserAlarmNotifications();
    await this.getUserSystemNotifications();
    this.subscribeToSystemMessages();
  }

  ngAfterViewInit() {
    this.headerHeight = this.headerElementRef.nativeElement.offsetHeight;
  }

  override ngOnDestroy(): void {
    if (this.refreshTokenIntervalId) {
      clearInterval(this.refreshTokenIntervalId);
    }

    super.ngOnDestroy();
  }

  async refreshTokenAtOnceAndRefreshPeriodically() {
    const token = CoreUtils.getCurrentState(this.store, AuthSelectors.selectToken);
    if (!token) {
      return; // should never be here
    }

    const action = await CoreUtils.dispatchAndWaitPromise(
      this.store,
      this.actions$,
      AuthActions.refreshToken(),
      AuthActions.refreshTokenSuccess,
      AuthActions.refreshTokenFailure
    );

    if (action.type === AuthActions.refreshTokenSuccess.type) {
      let refreshTokenIntervalMs = this.getRefreshTokenIntervalMs(action.token);
      const maxSetIntervalMs = 2147483647; // can't exceed this

      refreshTokenIntervalMs = Math.min(refreshTokenIntervalMs, maxSetIntervalMs);

      if (refreshTokenIntervalMs > 0) {
        this.refreshTokenPeriodically(refreshTokenIntervalMs);
      } else {
        console.warn(
          'Backend token is rejected by Web. It looks like the backend date is not in sync with the frontend date'
        );
        this.store.dispatch(AuthActions.logout());
      }
    }
  }

  refreshTokenPeriodically(interval: number): void {
    this.refreshTokenIntervalId = setInterval(() => {
      this.store.dispatch(AuthActions.refreshToken());
    }, interval);
  }

  private getRefreshTokenIntervalMs(justUpdatedToken: string): number {
    const jwtToken = AuthUtils.decodeToken(justUpdatedToken);

    const tokenExpirationAt = new Date(jwtToken.exp * 1000);
    const now = new Date();
    const expireFromNowMs = tokenExpirationAt.getTime() - now.getTime();
    return expireFromNowMs * 0.75;
  }

  private async getUserAlarmNotifications() {
    await CoreUtils.dispatchAndWaitPromise(
      this.store,
      this.actions$,
      AlarmNotificationActions.getNotifications(),
      AlarmNotificationActions.getNotificationsSuccess,
      AlarmNotificationActions.getNotificationsFailure
    );
  }

  private async getUserSystemNotifications() {
    await CoreUtils.dispatchAndWaitPromise(
      this.store,
      this.actions$,
      SystemNotificationActions.getNotifications(),
      SystemNotificationActions.getNotificationsSuccess,
      SystemNotificationActions.getNotificationsFailure
    );
  }

  private subscribeToSystemMessages() {
    this.coreService
      .getSystemMessageStream()
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((x) => {
        if (x.message.oneofKind === 'alarmNotification') {
          this.processAlarmNotification(x.message.alarmNotification);
        }
        if (x.message.oneofKind === 'systemNotification') {
          this.processSystemNotification(x.message.systemNotification);
        }
      });
  }

  processAlarmNotification(alarmNotification: MonitoringAlarmEvent) {
    this.store.dispatch(
      AlarmNotificationActions.addNotification({
        alarmNotification: MapUtils.toAlarmNotification(alarmNotification)
      })
    );
  }

  processSystemNotification(systemNotification: InAppSystemNotification) {
    this.logSystemNotification(systemNotification);

    if (systemNotification.inAppInternal) {
      this.inAppInternal(systemNotification.systemEvent!);
    }
    if (systemNotification.inApp) {
      this.store.dispatch(
        SystemNotificationActions.addNotification({
          systemNotification: MapUtils.toSystemNotification(systemNotification)
        })
      );
    }
  }

  private logSystemNotification(systemNotification: InAppSystemNotification) {
    if (systemNotification.systemEvent?.type === 'OtdrTaskProgress') {
      // do not log OtdrTaskProgress events, too much noise
      return;
    }

    console.log(
      'System message: ' + systemNotification.systemEvent!.type,
      systemNotification.systemEvent!.jsonData
    );
  }

  toggleSystemNotification() {
    this.store.dispatch(GlobalUiActions.toggleSystemNotification());
  }

  toggleAlarmNotification() {
    this.store.dispatch(GlobalUiActions.toggleAlarmNotification());
  }

  inAppInternal(systemEvent: SystemEvent) {
    switch (systemEvent.type) {
      case 'OtdrTaskProgress': {
        this.processOtdrTaskProgress(systemEvent);
        return;
      }
      case 'UserChanged': {
        const data = <UserChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(UsersActions.updateUserSuccess({ userId: data.UserId }));
        return;
      }
      case 'UserCreated': {
        const data = <UserCreatedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(UsersActions.createUserSuccess({ userId: data.UserId }));
        return;
      }
      case 'UserDeleted': {
        const data = <UserDeletedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(UsersActions.deleteUserSuccess({ userId: data.UserId }));
        return;
      }
      case 'OtauChanged': {
        const data = <OtauChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(OtausActions.updateOtauSuccess({ otauId: data.OtauId }));
        return;
      }
      case 'OtauInformationChanged': {
        const data = <OtauInformationChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(OtausActions.updateOtauSuccess({ otauId: data.OtauId }));
        return;
      }
      case 'OtauConnectionStatusChanged': {
        const data = <OtauConnectionStatusChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          OtausActions.otauConnectionStatusChanged({
            otauId: data.OtauId,
            isConnected: data.IsConnected,
            onlineAt: data.OnlineAt == null ? null : new Date(data.OnlineAt),
            offlineAt: data.OfflineAt == null ? null : new Date(data.OfflineAt)
          })
        );
        return;
      }
      case 'OtauRemoved': {
        const data = <OtauRemovedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(OtausActions.removeOtauSuccess({ otauId: data.OtauId }));
        return;
      }
      case 'OtauAdded': {
        const data = <OtauAddedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(OtausActions.addOtauSuccess({ otauId: data.OtauId }));
        return;
      }
      case 'MonitoringPortStatusChanged': {
        const data = <MonitoringPortStatusChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          MonitoringPortActions.setPortStatusSuccess({
            monitoringPortId: data.MonitoringPortId
          })
        );
        return;
      }
      case 'MonitoringPortScheduleChanged': {
        const data = <MonitoringPortScheduleChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          MonitoringPortActions.setPortScheduleSuccess({
            monitoringPortId: data.MonitoringPortId
          })
        );
        return;
      }
      case 'MonitoringPortAlarmProfileChanged': {
        const data = <MonitoringPortAlarmProfileChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          MonitoringPortActions.setPortAlarmProfileSuccess({
            monitoringPortId: data.MonitoringPortId
          })
        );
        return;
      }
      case 'AlarmProfileChanged': {
        const data = <AlarmProfileChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          AlarmProfilesActions.updateAlarmProfileSuccess({
            profileId: data.AlarmProfileId
          })
        );
        return;
      }
      case 'AlarmProfileCreated': {
        const data = <AlarmProfileCreatedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          AlarmProfilesActions.createAlarmProfileSuccess({
            profileId: data.AlarmProfileId
          })
        );
        return;
      }
      case 'AlarmProfileDeleted': {
        const data = <AlarmProfileDeletedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          AlarmProfilesActions.deleteAlarmProfileSuccess({
            alarmProfileId: data.AlarmProfileId
          })
        );
        return;
      }
      case 'NotificationSettingsUpdated': {
        const data = <NotificationSettingsUpdatedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(NotificationSettingsActions.updateNotificationSettingsSuccess());
        return;
      }
      case 'NetworkSettingsUpdated': {
        this.store.dispatch(NetworkSettingsActions.updateNetworkSettingsSuccess());
        return;
      }

      case 'TimeSettingsUpdated': {
        this.store.dispatch(TimeSettingsActions.updateTimeSettingsSuccess());
        return;
      }
      case 'RtuConnectionChecked': {
        const data = <RtuConnectionCheckedData>JSON.parse(systemEvent.jsonData);
        console.log(data);
        return;
      }
    }
  }

  private processOtdrTaskProgress(systemEvent: SystemEvent) {
    const data = <OtdrTaskProgressData>JSON.parse(systemEvent.jsonData);
    const progress = MapUtils.toOtdrTaskProgress(data);

    this.processTestQueueMonitor(progress);

    if (progress.taskType === 'ondemand') {
      const currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
      if (progress.createdByUserId === currentUser!.id) {
        // process only user's on-demand task
        this.processOnDemandProgress(progress);
      }
    } else if (progress.taskType === 'baseline') {
      this.processBaselineProgress(progress);
    }
  }

  private processOnDemandProgress(progress: OtdrTaskProgress) {
    const otdrTaskId = CoreUtils.getCurrentState(this.store, OnDemandSelectors.selectOtdrTaskId);

    if (otdrTaskId !== progress.otdrTaskId) {
      this.store.dispatch(
        OnDemandActions.startOnDemandSuccess({
          otdrTaskId: progress.otdrTaskId,
          monitoringPortId: progress.monitoringPortId
        })
      );
    }

    this.store.dispatch(OnDemandActions.onDemandProgress({ progress }));

    if (
      progress.status == 'completed' ||
      progress.status == 'failed' ||
      progress.status == 'cancelled'
    ) {
      this.store.dispatch(OnDemandActions.onDemandFinished({ progress }));
    }
  }

  private processBaselineProgress(progress: OtdrTaskProgress) {
    const monitoringPortId = +progress.otdrTaskId; // monitoringPortId is used as taskId for baseline tasks

    const otdrTask = CoreUtils.getCurrentState(
      this.store,
      BaselineSetupSelectors.selectOtdrTaskById(monitoringPortId)
    );

    if (otdrTask == null || otdrTask?.starting || otdrTask?.finished) {
      this.store.dispatch(
        BaselineSetupActions.startBaselineSuccess({
          monitoringPortId: monitoringPortId
        })
      );
    }

    this.store.dispatch(
      BaselineSetupActions.baselineProgress({
        monitoringPortId,
        progress
      })
    );

    if (
      progress.status == 'completed' ||
      progress.status == 'failed' ||
      progress.status == 'cancelled'
    ) {
      this.store.dispatch(
        BaselineSetupActions.baselineFinished({
          progress,
          monitoringPortId: monitoringPortId
        })
      );
    }
  }

  processTestQueueMonitor(progress: OtdrTaskProgress) {
    const current = CoreUtils.getCurrentState(this.store, TestQueueSelectors.selectCurrent);
    if (progress.status === 'running') {
      this.store.dispatch(TestQueueActions.setCurrent({ current: progress }));
    } else {
      if (progress.otdrTaskId == current?.otdrTaskId) {
        this.store.dispatch(TestQueueActions.setCurrent({ current: null }));
        this.store.dispatch(TestQueueActions.setLast({ last: progress }));
      }
    }
  }
}
