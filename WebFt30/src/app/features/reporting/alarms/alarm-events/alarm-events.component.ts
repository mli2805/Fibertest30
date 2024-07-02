import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AppState,
  LocalStorageService,
  MonitoringHistoryActions,
  OtausSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { AlarmEventsActions } from 'src/app/core/store/alarm-events/alarm-events.actions';
import { AlarmEventsSelectors } from 'src/app/core/store/alarm-events/alarm-events.selectors';
import {
  MonitoringAlarmEvent,
  MonitoringAlarmLevel,
  OtauPortPath
} from 'src/app/core/store/models';
import { BACK_TO_ALARM_EVENT } from '../alarm-view/alarm-view.component';
import { filter, takeUntil, tap, withLatestFrom } from 'rxjs';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

@Component({
  selector: 'rtu-alarm-events',
  templateUrl: './alarm-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmEventsComponent extends OnDestroyBase implements AfterViewInit, OnDestroy {
  convertUtils = ConvertUtils;
  alarmEventsActions = AlarmEventsActions;
  levels = MonitoringAlarmLevel;
  private router: Router = inject(Router);

  private store: Store<AppState> = inject(Store<AppState>);
  alarmEvents$ = this.store.select(AlarmEventsSelectors.selectAlarmEvents);
  loading$ = this.store.select(AlarmEventsSelectors.selectLoading);
  loadedTime$ = this.store.select(AlarmEventsSelectors.selectLoadedTime);
  errorMessageId$ = this.store.select(AlarmEventsSelectors.selectErrorMessageId);

  backToAlarmEventId = 0;

  constructor(private localStorageService: LocalStorageService) {
    super();

    this.backToAlarmEventId = localStorageService.getItem(BACK_TO_ALARM_EVENT) || 0;
    if (this.backToAlarmEventId != 0) {
      this.loadIfNotLoaded();
    } else {
      this.refresh();
    }
  }

  ngAfterViewInit(): void {
    this.scrollBack();
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
    this.localStorageService.setItem(BACK_TO_ALARM_EVENT, 0);
  }

  private loadIfNotLoaded() {
    const alarmEvents = CoreUtils.getCurrentState(
      this.store,
      AlarmEventsSelectors.selectAlarmEvents
    );
    if (!alarmEvents || alarmEvents.length == 0) {
      this.refresh();
    }
  }

  refresh() {
    this.store.dispatch(
      AlarmEventsActions.getAlarmEvents({ monitoringPortIds: this.monitoringPortIds })
    );
  }

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  private monitoringPortIds: number[] = [];
  onFilterChanged(selected: any) {
    this.monitoringPortIds = selected.selectedPorts.map((p: OtauPortPath) => p.monitoringPortId);
    this.refresh();
  }

  navigateToAlarm(alarmEventId: number) {
    this.router.navigate(['/reporting/alarms', alarmEventId]);
  }

  scrollBack() {
    this.alarmEvents$
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((alarmEvents) => alarmEvents !== null),
        filter((backToAlarmEventId) => this.backToAlarmEventId !== 0),
        tap((alarmEvents) => {
          setTimeout(() => {
            this.scrollToEvent(this.backToAlarmEventId);
          }, 1);
        })
      )
      .subscribe();
  }

  private scrollToEvent(alarmEventId: number) {
    const element = document.getElementById(alarmEventId.toString());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  saveTraceAndBaseForAlarmEvent(alarmEvent: MonitoringAlarmEvent) {
    this.store.dispatch(
      MonitoringHistoryActions.saveTraceAndBase({
        monitoringId: alarmEvent.monitoringResultId,
        monitoringPortId: alarmEvent.monitoringPortId,
        at: alarmEvent.at
      })
    );
  }
}
