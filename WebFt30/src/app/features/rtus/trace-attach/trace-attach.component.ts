import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, inject, Inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { AppState, RtuTreeActions } from 'src/app/core';
import { AttachTraceDto } from 'src/app/core/store/models/ft30/attach-trace-dto';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { Rtu } from 'src/grpc-generated/rtu_tree';

@Component({
  selector: 'rtu-trace-attach',
  templateUrl: './trace-attach.component.html'
})
export class TraceAttachComponent implements OnInit {
  @Input() windowId!: string;
  @Input() zIndex!: number;
  @Input() payload!: any;

  public store: Store<AppState> = inject(Store);
  traces!: Trace[];
  selectedTrace!: Trace;
  portOfOtau!: PortOfOtau;
  rtu!: Rtu;

  constructor(private windowService: WindowService) {}

  ngOnInit(): void {
    this.traces = this.payload.traces;
    this.selectedTrace = this.traces[0];
    this.portOfOtau = this.payload.portOfOtau;
    console.log(this.portOfOtau);
    this.rtu = this.payload.rtu;
  }

  getPortTitle() {
    return this.portOfOtau.isPortOnMainCharon
      ? this.portOfOtau.opticalPort
      : `${this.portOfOtau.mainCharonPort}-${this.portOfOtau.opticalPort}`;
  }

  onSelectedChanged(trace: Trace) {
    this.selectedTrace = trace;
  }

  onAttachClicked() {
    const dto = new AttachTraceDto();
    dto.traceId = this.selectedTrace.traceId;
    dto.portOfOtau = [this.portOfOtau];

    console.log(dto);
    this.store.dispatch(RtuTreeActions.attachTrace({ dto }));

    this.close();
  }

  onCancelClicked() {
    this.close();
  }

  close() {
    this.windowService.unregisterWindow(this.windowId, 'TraceAttach');
  }
}
