import { ChangeDetectionStrategy, Component, Inject, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, MonitoringPortSelectors, UsersSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ActiveAlarmsSelectors } from 'src/app/core/store/active-alarms/active-alarms.selectors';
import { MonitoringAlarm, MonitoringAlarmLevel } from 'src/app/core/store/models';
import { MonitoringPortStatus } from 'src/grpc-generated';

@Component({
  selector: 'rtu-port-alarm-status',
  templateUrl: 'port-alarm-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortAlarmStatusComponent {
  levels = MonitoringAlarmLevel;

  monitoringPortStatuses = MonitoringPortStatus;

  portActiveAlarms$!: Observable<MonitoringAlarm[]>;

  private _monitoringPortId!: number;

  @Input() set monitoringPortId(value: number) {
    this._monitoringPortId = value;
    this.portActiveAlarms$ = this.store.select(
      ActiveAlarmsSelectors.selectActiveAlarmsByMonitoringPortId(this._monitoringPortId)
    );
  }

  get monitoringPortId() {
    return this._monitoringPortId;
  }

  store = inject(Store<AppState>);

  getMonitoringPortById(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      MonitoringPortSelectors.selectMonitoringPortById(monitoringPortId)
    );
  }

  getMostSevereAlarm(alarms: MonitoringAlarm[]) {
    return alarms.length === 0 ? null : alarms.sort((a, b) => b.level - a.level)[0];
  }
}
