import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { ActiveAlarmsActions } from 'src/app/core/store/active-alarms/active-alarms.actions';
import { ActiveAlarmsSelectors } from 'src/app/core/store/active-alarms/active-alarms.selectors';
import { MonitoringAlarmLevel } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-active-alarms',
  templateUrl: 'active-alarms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveAlarmsComponent {
  converterUtils = ConvertUtils;
  levels = MonitoringAlarmLevel;
  selectedFullHistoryAlarmId: number | null = null;
  // statuses = MonitoringAlarmStatus;

  activeAlarms$ = this.store.select(ActiveAlarmsSelectors.selectActiveAlarmsAlarms);
  loading$ = this.store.select(ActiveAlarmsSelectors.selectLoading);
  loadedTime$ = this.store.select(ActiveAlarmsSelectors.selectLoadedTime);
  // errorMessageId$ = this.store.select(ActiveAlarmsSelectors.selectErrorMessageId);

  constructor(private store: Store<AppState>) {
    // this.loadIfNotLoaded();
  }

  // private loadIfNotLoaded() {
  //   const loaded = CoreUtils.getCurrentState(this.store, ActiveAlarmsSelectors.selectLoaded);
  //   if (!loaded) {
  //     this.refresh();
  //   }
  // }

  // refresh() {
  //   this.store.dispatch(ActiveAlarmsActions.getActiveAlarms());
  // }

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
}
