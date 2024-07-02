import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MonitoringPortScheduleChangedData } from '../../system-event-data';
import { SystemEvent } from 'src/app/core/store/models';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { MonitoringSchedulerMode } from 'src/grpc-generated';
import { ConvertUtils } from 'src/app/core/convert.utils';

@Component({
  templateUrl: 'monitoring-port-schedule-changed-system-event-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringPortScheduleChangedSystemEventViewerComponent {
  public data!: MonitoringPortScheduleChangedData;
  public schedule!: string;
  public interval!: any;
  public slotsString!: string;

  convertUtils = ConvertUtils;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <MonitoringPortScheduleChangedData>JSON.parse(value.jsonData);

    if (this.data.Mode === MonitoringSchedulerMode.RoundRobin)
      this.schedule = ConvertUtils.scheduleModeToString(this.data.Mode);
    else if (this.data.Mode === MonitoringSchedulerMode.AtLeastOnceIn) {
      this.schedule = ConvertUtils.scheduleModeToString(this.data.Mode);
      const sec: number = 1 * this.data.Interval!;
      this.interval = ConvertUtils.scheduleIntervalToObject(sec);
    } else if (this.data.Mode === MonitoringSchedulerMode.FixedTimeSlot) {
      this.schedule = ConvertUtils.scheduleModeToString(this.data.Mode);
      this.slotsString = '' + this.data.TimeSlotIds[0];
      if (this.data.TimeSlotIds.length > 1) this.slotsString = this.slotsString + ' ...';
    }
  }

  @Output() navigatedToEvent = new EventEmitter<any>();

  constructor(private store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }
}
