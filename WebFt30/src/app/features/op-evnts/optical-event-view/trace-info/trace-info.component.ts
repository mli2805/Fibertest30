import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';

@Component({
  selector: 'rtu-trace-info',
  templateUrl: './trace-info.component.html',
  styleUrls: ['./trace-info.component.scss']
})
export class TraceInfoComponent {
  _opticalEvent!: OpticalEvent;
  @Input() set opticalEvent(value: OpticalEvent) {
    this._opticalEvent = value;
    const trace = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectTrace(value.traceId!)
    );

    this.traceTitle = trace!.title;
    this.port = this.getTracePort(trace!.port);
    const rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(trace!.rtuId));
    this.rtuTitle = rtu!.title;
    this.stateAt = this.ts.instant('i18n.ft.trace-state-at', {
      0: value.registeredAt,
      1: value.eventId
    });
  }

  //
  traceTitle!: string;
  port!: string;
  rtuTitle!: string;
  stateAt!: string;
  traceState!: string;
  //

  constructor(private store: Store<AppState>, private ts: TranslateService) {}

  getTracePort(port: PortOfOtau | null) {
    if (port === null) return this.ts.instant('i18n.ft.not-attached');

    return port.isPortOnMainCharon
      ? port.opticalPort
      : `${port.mainCharonPort} - ${port.opticalPort}`;
  }
}
