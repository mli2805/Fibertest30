import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, MonitoringHistoryActions, OtausSelectors } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import {
  MonitoringAlarm,
  MonitoringAlarmEvent,
  MonitoringAlarmStatus
} from 'src/app/core/store/models';
import { MonitoringAlarmLevel } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-alarms-with-events-table',
  templateUrl: './alarms-with-events-table.component.html'
})
export class AlarmsWithEventsTableComponent {
  @Input() mode: 'active' | 'all' = 'all';
  @Input() alarms!: MonitoringAlarm[];

  converterUtils = ConvertUtils;
  levels = MonitoringAlarmLevel;
  statuses = MonitoringAlarmStatus;
  selectedFullHistoryAlarmId: number | null = null;

  private router: Router = inject(Router);

  constructor(private store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  setSelectedFullHistory(alarmId: number) {
    if (this.selectedFullHistoryAlarmId === alarmId) {
      this.selectedFullHistoryAlarmId = null;
    } else {
      this.selectedFullHistoryAlarmId = alarmId;
    }
  }

  navigateToAlarm(alarm: MonitoringAlarm) {
    const alarmEventId = alarm.events[0].id;
    this.router.navigate(['/reporting/alarms', alarmEventId]);
  }
  navigateToAlarmEvent(alarmEventId: number) {
    this.router.navigate(['/reporting/alarms', alarmEventId]);
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

  saveTraceAndBaseForAlarm(alarm: MonitoringAlarm) {
    this.store.dispatch(
      MonitoringHistoryActions.saveTraceAndBase({
        monitoringId: alarm.monitoringResultId,
        monitoringPortId: alarm.monitoringPortId,
        at: alarm.lastChangedAt
      })
    );
  }
}
