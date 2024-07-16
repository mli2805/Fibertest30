import { Component, Input } from '@angular/core';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { MonitoringState, RtuPartState } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
  selector: 'rtu-one-bop',
  templateUrl: './one-bop.component.html'
})
export class OneBopComponent {
  private _bop!: Bop;
  @Input() set bop(value: Bop) {
    this._bop = value;
    this.bopState = this._bop.isOk ? RtuPartState.Ok : RtuPartState.Broken;
    this.lineContent = `N${this._bop.masterPort}: ${this._bop.bopNetAddress.toString()}`;
  }
  get bop() {
    return this._bop;
  }
  bopState!: RtuPartState;
  lineContent!: string;

  @Input() children!: any[];

  private _i!: number;
  @Input() set i(value: number) {
    this._i = value;
  }
  get i() {
    return this._i;
  }

  @Input() rtuMonitoringMode!: MonitoringState;

  isExpanded = false;
  flipExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
