import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, TreeNavigationService, RtuTreeSelectors } from 'src/app/core';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
    selector: 'rtu-one-rtu',
    templateUrl: './one-rtu.component.html',
    standalone: false
})
export class OneRtuComponent {
  public rtu$: Observable<Rtu | null> = EMPTY;
  private _rtuId!: string;
  @Input() set rtuId(value: string) {
    this._rtuId = value;
    this.isExpanded = this.navigationService.isBranchExpanded(value);
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(value));
  }

  @Input() i!: number;

  isExpanded!: boolean;

  constructor(private store: Store<AppState>, private navigationService: TreeNavigationService) {}

  flipExpanded() {
    this.isExpanded = !this.isExpanded;
    this.navigationService.setBranchState(this._rtuId, this.isExpanded);
  }

  getDetachedTraces(rtu: Rtu) {
    return rtu.traces.filter((t) => t.port === null);
  }
}
