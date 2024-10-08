import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-attached-trace',
  templateUrl: './attached-trace.component.html'
})
export class AttachedTraceComponent {
  public rtu$: Observable<Rtu | null> = EMPTY;
  @Input() set rtuId(value: string) {
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(value));
  }

  public trace$: Observable<Trace | null> = EMPTY;
  @Input() set traceId(value: string) {
    this.trace$ = this.store.select(RtuTreeSelectors.selectTrace(value));
  }

  @Input() i!: number;

  constructor(private store: Store<AppState>) {}
}
