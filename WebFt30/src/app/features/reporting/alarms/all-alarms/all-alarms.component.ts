import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { AllAlarmsActions } from 'src/app/core/store/all-alarms/all-alarms.actions';
import { AllAlarmsSelectors } from 'src/app/core/store/all-alarms/all-alarms.selectors';
import { MonitoringAlarmLevel, OtauPortPath } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-all-alarms',
  templateUrl: './all-alarms.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllAlarmsComponent {
  converterUtils = ConvertUtils;
  allAlarmsActions = AllAlarmsActions;
  levels = MonitoringAlarmLevel;
  selectedFullHistoryAlarmId: number | null = null;

  allAlarms$ = this.store.select(AllAlarmsSelectors.selectAllAlarms);
  loading$ = this.store.select(AllAlarmsSelectors.selectLoading);
  loadedTime$ = this.store.select(AllAlarmsSelectors.selectLoadedTime);
  errorMessageId$ = this.store.select(AllAlarmsSelectors.selectErrorMessageId);

  constructor(private store: Store<AppState>) {
    this.refresh();
  }

  refresh() {
    this.store.dispatch(
      AllAlarmsActions.getAllAlarms({ monitoringPortIds: this.monitoringPortIds })
    );
  }

  private monitoringPortIds: number[] = [];
  onFilterChanged(selected: any) {
    this.monitoringPortIds = selected.selectedPorts.map((p: OtauPortPath) => p.monitoringPortId);
    this.refresh();
  }

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
