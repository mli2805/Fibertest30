import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeActions } from 'src/app/core';
import { AttachTraceDto } from 'src/app/core/store/models/ft30/attach-trace-dto';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-trace-attach',
  templateUrl: './trace-attach.component.html',
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class TraceAttachComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  public store: Store<AppState> = inject(Store);
  traces!: Trace[];
  selectedTrace!: Trace;
  portOfOtau!: PortOfOtau;

  constructor(@Inject(DIALOG_DATA) private data: any, private cdr: ChangeDetectorRef) {
    this.traces = data.traces;
    this.selectedTrace = this.traces[0];
    this.portOfOtau = data.portOfOtau;
  }

  onSelectedChanged(trace: Trace) {
    this.selectedTrace = trace;
  }

  onAttachClicked() {
    const dto = new AttachTraceDto();
    dto.traceId = this.selectedTrace.traceId;
    dto.portOfOtau = [this.portOfOtau];

    this.store.dispatch(RtuTreeActions.attachTrace({ dto }));

    this.dialogRef.close();
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}
