import { Component, Input } from '@angular/core';
import { MonitoringState } from 'src/app/core/store/models/ft30/ft-enums';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-detached-trace',
  templateUrl: './detached-trace.component.html'
})
export class DetachedTraceComponent {
  private _trace!: Trace;
  @Input() set trace(value: Trace) {
    this._trace = value;
  }
  get trace() {
    return this._trace;
  }

  @Input() i!: number;
  // for detached trace is undefined
  rtuMonitoringMode!: MonitoringState;
}
