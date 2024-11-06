import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, RtuTreeSelectors, TreeNavigationService } from 'src/app/core';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
  selector: 'rtu-one-bop',
  templateUrl: './one-bop.component.html'
})
export class OneBopComponent {
  public rtu$: Observable<Rtu | null> = EMPTY;
  @Input() set rtuId(value: string) {
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(value));
  }

  private _bopId!: string;
  public bop$: Observable<Bop | null> = EMPTY;
  @Input() set bopId(value: string) {
    this._bopId = value;
    this.isExpanded = this.navigationService.isBranchExpanded(value);
    this.bop$ = this.store.select(RtuTreeSelectors.selectBop(value));
  }

  constructor(private store: Store<AppState>, private navigationService: TreeNavigationService) {}

  private _i!: number;
  @Input() set i(value: number) {
    this._i = value;
  }
  get i() {
    return this._i;
  }

  isExpanded!: boolean;
  flipExpanded() {
    this.isExpanded = !this.isExpanded;
    this.navigationService.setBranchState(this._bopId, this.isExpanded);
  }

  getDetachedTraces(rtu: Rtu) {
    return rtu.traces.filter((t) => t.port === null);
  }
}
