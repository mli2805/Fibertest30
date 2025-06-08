import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { BehaviorSubject } from 'rxjs';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DragWatcher } from 'src/app/shared/utils/drag-watcher';

@Component({
  selector: 'rtu-trace-assign-base-dialog',
  templateUrl: './trace-assign-base-dialog.component.html'
})
export class TraceAssignBaseDialogComponent implements AfterViewInit {
  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  traceInfoData = new BehaviorSubject<Trace | null>(null);

  traceInfoData$ = this.traceInfoData.asObservable();

  _traceId!: string;
  @Input() set traceId(value: string) {
    this._traceId = value;
    const trace = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectTrace(value));
    this.traceInfoData.next(trace);
  }

  constructor(private store: Store<AppState>, private windowService: WindowService) {}

  ngAfterViewInit() {
    this.dragRef.setFreeDragPosition({ x: 290, y: 75 });
  }

  // кнопка нажата внутри
  async onCloseEvent() {
    this.windowService.unregisterWindow(this._traceId, 'TraceAssignBaseRefs');
  }

  close() {
    this.windowService.unregisterWindow(this._traceId, 'TraceAssignBaseRefs');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
