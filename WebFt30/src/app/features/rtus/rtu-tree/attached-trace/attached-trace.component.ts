import { Component, Input } from '@angular/core';
import { MonitoringState } from 'src/app/core/store/models/ft30/ft-enums';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-attached-trace',
  templateUrl: './attached-trace.component.html'
})
export class AttachedTraceComponent {
  @Input() trace!: Trace;

  @Input() rtuMonitoringMode!: MonitoringState;
  @Input() isRtuAvailableNow!: boolean;
  @Input() i!: number;

  isMonitoringOn() {
    return this.rtuMonitoringMode === MonitoringState.On;
  }
}
