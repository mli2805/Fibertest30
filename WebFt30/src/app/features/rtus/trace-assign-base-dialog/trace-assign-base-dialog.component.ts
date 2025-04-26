import { Component, Input, OnInit } from '@angular/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { BehaviorSubject } from 'rxjs';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-trace-assign-base-dialog',
  templateUrl: './trace-assign-base-dialog.component.html'
})
export class TraceAssignBaseDialogComponent {
  traceInfoData = new BehaviorSubject<Trace | null>(null);

  traceInfoData$ = this.traceInfoData.asObservable();

  _traceId!: string;
  @Input() set traceId(value: string) {
    this._traceId = value;
    const trace = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectTrace(value));
    this.traceInfoData.next(trace);
  }

  constructor(private store: Store<AppState>, private windowService: WindowService) {}

  // кнопка нажата внутри
  async onCloseEvent() {
    this.windowService.unregisterWindow(this._traceId, 'TraceAssignBaseRefs');
  }

  close() {
    this.windowService.unregisterWindow(this._traceId, 'TraceAssignBaseRefs');
  }
}
