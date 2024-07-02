import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MonitoringPortAlarmProfileChangedData } from '../../system-event-data/monitoring/monitoring-port-alarm-profile-changed-data';
import { SystemEvent } from 'src/app/core/store/models';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { AlarmProfilesSelectors } from 'src/app/core/store/alarm-profile/alarm-profiles.selectors';

@Component({
  templateUrl: 'monitoring-port-alarm-profile-changed-event-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringPortAlarmProfileChangedEventViewerComponent {
  public data!: MonitoringPortAlarmProfileChangedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <MonitoringPortAlarmProfileChangedData>JSON.parse(value.jsonData);
  }

  @Output() navigatedToEvent = new EventEmitter<any>();

  constructor(private store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  getAlarmProfileById(alarmProfileId: number) {
    const profiles = CoreUtils.getCurrentState(
      this.store,
      AlarmProfilesSelectors.selectAlarmProfilesArray
    );

    const profile = profiles.find((p) => p.id === alarmProfileId);
    return profile;
  }
}
