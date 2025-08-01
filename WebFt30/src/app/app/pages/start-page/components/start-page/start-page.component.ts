import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { firstValueFrom, takeUntil } from 'rxjs';
import {
  AppState,
  AuthActions,
  AuthSelectors,
  SystemNotificationActions,
  GlobalUiActions,
  GlobalUiSelectors,
  RtuTreeActions,
  AudioEventsActions,
  AudioEventsSelectors,
  DeviceActions,
  RtuTreeSelectors,
  SettingsSelectors,
  LandmarksModelsActions,
  OpticalEventsActions,
  OpticalEventsSelectors
} from 'src/app/core';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { CoreService } from 'src/app/core/grpc/services/core.service';
import { MapUtils } from 'src/app/core/map.utils';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { InAppSystemNotification, SystemEvent } from 'src/grpc-generated';
import { UsersActions } from 'src/app/core/store/users/users.actions';
import {
  UserChangedData,
  UserCreatedData,
  UserDeletedData,
  NotificationSettingsUpdatedData
} from 'src/app/shared/system-events/system-event-data';
import { NotificationSettingsActions } from 'src/app/core/store/notification-settings/notification-settings.action';
import { RtuConnectionCheckedData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/rtu-connection-checked-data';
import { RtuInitializedData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/rtu-initialized-data';
import { MeasurementClientDoneData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/measurement-client-done-data';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { MonitoringStoppedData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/monitoring-stopped-data';
import { MonitoringSettingsAppliedData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/monitoring-settings-applied-data';
import { BaseRefsAssignedData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/base-refs-assigned-data';
import { AudioEvent } from 'src/app/core/store/models/ft30/audio-event';
import { AudioService } from 'src/app/core/services/audio.service';
import {
  OtauAttachedData,
  OtauDetachedData
} from 'src/app/shared/system-events/system-event-data/rtu-mgmt/otau-data';
import {
  BopNetworkEventAddedData,
  NetworkEventAddedData,
  RtuStateAccidentAddedData,
  TraceStateChangedData
} from 'src/app/shared/system-events/system-event-data/accidents/accidents-data';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { WindowService } from '../window.service';
import { BaseRefType, EventStatus } from 'src/app/core/store/models/ft30/ft-enums';
import { AudioEventsMapping } from './audio-events-mapping';
import { LandmarksUpdateProgressedData } from 'src/app/shared/system-events/system-event-data/landmarks-update';
import { MeasurementAddedData } from 'src/app/shared/system-events/system-event-data/rtu-mgmt/measurement-added-data';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { Router } from '@angular/router';
import { RtuAddedData } from 'src/app/shared/system-events/system-event-data/graph/rtu-added-data';
import {
  TraceAttachedData,
  TraceDetachedData,
  TraceAddedData,
  TraceCleanedData,
  TraceRemovedData
} from 'src/app/shared/system-events/system-event-data/graph/trace-data';
import { MeasurementUpdatedData } from 'src/app/shared/system-events/system-event-data/graph/measurement-updated-data';

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
    private audioService: AudioService,
    private coreService: CoreService,
    private gisMapService: GisMapService,
    private router: Router,
    public windowService: WindowService
  ) {
    super();
  }

  async ngOnInit() {
    await this.refreshTokenAtOnceAndRefreshPeriodically();
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
        if (x.message.oneofKind === 'systemNotification') {
          this.processSystemNotification(x.message.systemNotification);
        }
      });
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

      case 'NotificationSettingsUpdated': {
        const data = <NotificationSettingsUpdatedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(NotificationSettingsActions.updateNotificationSettingsSuccess());
        return;
      }

      case 'RtuConnectionChecked': {
        const data = <RtuConnectionCheckedData>JSON.parse(systemEvent.jsonData);
        return;
      }
      case 'RtuInitialized': {
        const data = <RtuInitializedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'MeasurementClientDone': {
        const data = <MeasurementClientDoneData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(
          RtuMgmtActions.measurementClientDone({ measurementClientId: data.MeasurementClientId })
        );
        return;
      }
      case 'MonitoringStopped': {
        const data = <MonitoringStoppedData>JSON.parse(systemEvent.jsonData);
        if (!data.IsSuccess) return;
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'MonitoringSettingsApplied': {
        const data = <MonitoringSettingsAppliedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'BaseRefsAssigned': {
        const data = <BaseRefsAssignedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        this.gisMapService.externalCommand.next({
          name: 'BaseRefsAssigned',
          traceId: data.TraceId,
          hasBaseRefs: data.HasBaseRefs
        });
        return;
      }
      case 'TraceAttached': {
        const data = <TraceAttachedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        this.gisMapService.externalCommand.next({ name: 'TraceAttached', traceId: data.TraceId });
        return;
      }
      case 'TraceDetached': {
        const data = <TraceDetachedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        this.gisMapService.externalCommand.next({ name: 'TraceDetached', traceId: data.TraceId });
        return;
      }
      case 'OtauAttached': {
        const data = <OtauAttachedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'OtauDetached': {
        const data = <OtauDetachedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'TraceAdded': {
        const data = <TraceAddedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'TraceCleaned': {
        const data = <TraceCleanedData>JSON.parse(systemEvent.jsonData);
        const trace = CoreUtils.getCurrentState(
          this.store,
          RtuTreeSelectors.selectTrace(data.TraceId)
        )!;
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: trace.rtuId }));
        this.gisMapService.externalCommand.next({ name: 'TraceCleaned', traceId: data.TraceId });
        return;
      }
      case 'TraceRemoved': {
        const data = <TraceRemovedData>JSON.parse(systemEvent.jsonData);
        const trace = CoreUtils.getCurrentState(
          this.store,
          RtuTreeSelectors.selectTrace(data.TraceId)
        )!;
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: trace.rtuId }));
        this.gisMapService.externalCommand.next({ name: 'TraceRemoved', traceId: data.TraceId });
        return;
      }
      case 'RtuAdded':
      case 'RtuUpdated':
      case 'RtuAddressCleared':
      case 'RtuRemoved': {
        const data = <RtuAddedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(RtuTreeActions.refreshRtuTree());
        this.gisMapService.externalCommand.next({ name: 'RtuAdded' }); // чтобы перечитать граф
        return;
      }
      case 'TraceStateChanged': {
        const data = <TraceStateChangedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(OpticalEventsActions.getOpticalEvent({ eventId: data.EventId }));

        // перерисовать в дереве
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        // перерисовать на карте
        this.gisMapService.externalCommand.next({
          name: 'TraceStateChanged',
          traceId: data.TraceId,
          traceState: data.TraceState
        });

        // а вот сигнализация Подозрений по флагу
        if (data.BaseRefType === BaseRefType.Fast) {
          const switchOfSignalling = CoreUtils.getCurrentState(
            this.store,
            SettingsSelectors.selectSwitchOffSuspicionSignalling
          );
          if (switchOfSignalling) {
            console.log(`Current user switched off Suspicion signalling!`);
            return;
          }
        }

        // если не вышли по отключенной сигнализации, то добавляем в Новые события
        const audioEvent = AudioEventsMapping.mapFromTraceStateChanged(data);
        this.addOrReplace(audioEvent);
        this.store.dispatch(DeviceActions.getHasCurrentEvents());
        this.audioService.play(audioEvent);

        return;
      }
      case 'NetworkEventAdded': {
        const data = <NetworkEventAddedData>JSON.parse(systemEvent.jsonData);
        const audioEvent = AudioEventsMapping.mapFromNetworkEventAdded(data);
        this.addOrReplace(audioEvent);
        this.store.dispatch(DeviceActions.getHasCurrentEvents());
        this.audioService.play(audioEvent);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'BopNetworkEventAdded': {
        const data = <BopNetworkEventAddedData>JSON.parse(systemEvent.jsonData);
        const audioEvent = AudioEventsMapping.mapFromBopNetworkEventAdded(data);
        this.addOrReplace(audioEvent);
        this.store.dispatch(DeviceActions.getHasCurrentEvents());
        this.audioService.play(audioEvent);
        this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: data.RtuId }));
        return;
      }
      case 'RtuStateAccidentAdded': {
        const data = <RtuStateAccidentAddedData>JSON.parse(systemEvent.jsonData);

        const switchOfSignalling = CoreUtils.getCurrentState(
          this.store,
          SettingsSelectors.selectSwitchOffRtuStatusEventsSignalling
        );
        if (switchOfSignalling) {
          console.log(`Current user switched off RTU state accidents signalling!`);
          return;
        }

        // если не вышли по отключенной сигнализации, то добавляем в Новые события
        const audioEvent = AudioEventsMapping.mapFromRtuStateAccidentAdded(data);
        this.addOrReplace(audioEvent);
        this.store.dispatch(DeviceActions.getHasCurrentEvents());
        this.audioService.play(audioEvent);
        return;
      }
      case 'LandmarksUpdateProgressed': {
        const data = <LandmarksUpdateProgressedData>JSON.parse(systemEvent.jsonData);
        this.store.dispatch(LandmarksModelsActions.updateLandmarksProgress({ line: data }));
        return;
      }
      case 'MeasurementAdded': {
        const data = <MeasurementAddedData>JSON.parse(systemEvent.jsonData);

        // если пользователь не проводит сейчас точное изм вне очереди
        // traceId будет null и переход на страницу измерения не происходит
        const traceId = CoreUtils.getCurrentState(
          this.store,
          RtuMgmtSelectors.selectOutOfTurnTraceId
        );
        if (traceId === data.TraceId) {
          this.store.dispatch(
            RtuMgmtActions.preciseMeasurementOutOfTurnDone({ outOfTurnSorFileId: data.SorFileId })
          );
          this.windowService.unregisterWindow(traceId, 'OutOfTurnMeasurement');

          const measUrl = `/op-evnts/optical-events/${data.SorFileId.toString()}`;
          this.router.navigate([measUrl], { queryParams: { open: 'sor' } });
        }
        return;
      }
      case 'MeasurementUpdated': {
        const data = <MeasurementUpdatedData>JSON.parse(systemEvent.jsonData);
        // если это не измерение по расписанию
        if (data.EventStatus >= EventStatus.EventButNotAnAccident) {
          // и если это событие сейчас есть в хранилище
          const opticalEvent = CoreUtils.getCurrentState(
            this.store,
            OpticalEventsSelectors.selectOpticalEventById(data.SorFileId)
          );
          if (opticalEvent) {
            this.store.dispatch(OpticalEventsActions.getOpticalEvent({ eventId: data.SorFileId }));
          }
        }
        return;
      }
    }
  }

  private addOrReplace(newEvent: AudioEvent) {
    const events = CoreUtils.getCurrentState(this.store, AudioEventsSelectors.selectAudioEvents);
    const oldEvent = events.find(
      (e) => e.eventType === newEvent.eventType && e.objId === newEvent.objId
    );
    if (oldEvent !== undefined) {
      this.store.dispatch(AudioEventsActions.removeEvent({ removeEvent: oldEvent }));
    }
    this.store.dispatch(AudioEventsActions.addEvent({ newEvent: newEvent }));
  }
}
