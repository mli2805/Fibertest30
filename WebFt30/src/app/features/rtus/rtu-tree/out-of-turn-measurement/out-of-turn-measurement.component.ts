import { Component, inject, Input, OnInit } from '@angular/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { SecUtil } from '../../rtu-monitoring-settings/sec-util';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';

@Component({
    selector: 'rtu-out-of-turn-measurement',
    templateUrl: './out-of-turn-measurement.component.html',
    standalone: false
})
export class OutOfTurnMeasurementComponent implements OnInit {
  @Input() traceId!: string;
  @Input() zIndex!: number;
  @Input() payload!: any;

  public store: Store<AppState> = inject(Store);

  trace!: Trace;
  durationStr!: string;

  spin$ = this.store.select(RtuMgmtSelectors.selectOutOfTurnTraceId);

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    this.trace = this.payload.trace;
    this.durationStr = SecUtil.secToString(this.trace.preciseDuration);
  }

  onCancelClick() {
    this.store.dispatch(RtuMgmtActions.interruptMeasurement({ rtuId: this.trace.rtuId }));
    this.close();
  }

  close() {
    this.windowService.unregisterWindow(this.traceId, 'OutOfTurnMeasurement');
  }
}
