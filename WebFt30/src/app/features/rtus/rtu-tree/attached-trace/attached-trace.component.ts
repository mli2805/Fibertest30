import { Component, Input } from '@angular/core';
import { MonitoringState } from 'src/app/core/store/models/ft30/ft-enums';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-attached-trace',
  templateUrl: './attached-trace.component.html'
})
export class AttachedTraceComponent {
  private _trace!: Trace;
  @Input() set trace(value: Trace) {
    this._trace = value;
    this.lineContent = `N${this._trace.port!.opticalPort}: ${this._trace.title}`;
  }
  get trace() {
    return this._trace;
  }

  @Input() rtuMonitoringMode!: MonitoringState;
  @Input() i!: number;

  lineContent!: string;
}
