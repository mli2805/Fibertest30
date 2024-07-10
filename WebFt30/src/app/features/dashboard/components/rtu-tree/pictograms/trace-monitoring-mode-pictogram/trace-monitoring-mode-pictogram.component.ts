import { Component, Input } from '@angular/core';
import { MonitoringState } from 'src/app/core/store/models/ft30/ft-enums';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-trace-monitoring-mode-pictogram',
  templateUrl: './trace-monitoring-mode-pictogram.component.html'
})
export class TraceMonitoringModePictogramComponent {
  monitoringState = MonitoringState;

  @Input() trace!: Trace;
  @Input() rtuMonitoringMode!: MonitoringState;
}
