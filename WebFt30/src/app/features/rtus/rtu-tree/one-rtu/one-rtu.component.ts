import { Component, Input } from '@angular/core';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { RtuPartState } from 'src/app/core/store/models/ft30/ft-enums';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
  selector: 'rtu-one-rtu',
  templateUrl: './one-rtu.component.html'
})
export class OneRtuComponent {
  private _rtu!: Rtu;
  @Input() set rtu(value: Rtu) {
    this._rtu = value;
    this.setBopsStateAndChildren();
  }
  get rtu() {
    return this._rtu;
  }

  @Input() children!: any[];
  @Input() i!: number;

  // aggregate state of all bops of this rtu
  bopState!: RtuPartState;

  setBopsStateAndChildren() {
    this.bopState = RtuPartState.NotSetYet;
    this.collectionOfChildren = [];
    for (const bop of this._rtu.bops) {
      if (bop.isOk) this.bopState = RtuPartState.Ok;
      else {
        this.bopState = RtuPartState.Broken;
        return;
      }
      this.arrangeBopChildren(this._rtu, bop);
    }
  }

  isExpanded = false;
  flipExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  collectionOfChildren!: any[];
  arrangeBopChildren(rtu: Rtu, bop: Bop) {
    for (let i = 0; i < rtu.ownPortCount; i++) {
      const oneBopChildren: any[] = [];
      const bop = rtu.bops.find((b) => b.masterPort === i + 1);
      if (bop !== undefined) {
        for (let i = 0; i < bop.portCount; i++) {
          const trace = bop.traces.find((t) => t.port !== null && t.port.opticalPort === i + 1);
          if (trace !== undefined) {
            const child = { type: 'attached-trace', port: i + 1, payload: trace };
            oneBopChildren.push(child);
            continue;
          }
          const child = { type: 'free-port', port: i + 1, payload: null };
          oneBopChildren.push(child);
        }
      }
      this.collectionOfChildren.push(oneBopChildren);
    }
  }
}
