import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { MonitoringState, RtuPartState } from 'src/app/core/store/models/ft30/ft-enums';
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

  public bop$: Observable<Bop | null> = EMPTY;
  @Input() set bopId(value: string) {
    this.bop$ = this.store.select(RtuTreeSelectors.selectBop(value));
  }

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {}

  // private _bop!: Bop;
  // @Input() set bop(value: Bop) {
  //   this._bop = value;
  //   this.bopState = this._bop.isOk ? RtuPartState.Ok : RtuPartState.Broken;
  // }
  // get bop() {
  //   return this._bop;
  // }
  // bopState!: RtuPartState;

  // @Input() children!: any[];

  private _i!: number;
  @Input() set i(value: number) {
    this._i = value;
  }
  get i() {
    return this._i;
  }

  // @Input() isRtuAvailableNow!: boolean;
  // @Input() rtuMonitoringMode!: MonitoringState;

  // isMonitoringOn() {
  //   return this.rtuMonitoringMode === MonitoringState.On;
  // }

  isExpanded = false;
  flipExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
