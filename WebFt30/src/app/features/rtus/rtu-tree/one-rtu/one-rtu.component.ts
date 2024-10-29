import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
  selector: 'rtu-one-rtu',
  templateUrl: './one-rtu.component.html'
})
export class OneRtuComponent {
  public rtu$: Observable<Rtu | null> = EMPTY;
  @Input() set rtuId(value: string) {
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(value));
  }

  @Input() i!: number;

  isExpanded = false;

  constructor(private store: Store<AppState>) {}

  flipExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  getDetachedTraces(rtu: Rtu) {
    return rtu.traces.filter((t) => t.port === null);
  }
}
