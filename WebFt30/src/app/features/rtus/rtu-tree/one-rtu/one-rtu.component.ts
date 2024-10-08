import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
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

  private _rtu!: Rtu;
  @Input() set rtu(value: Rtu) {
    this._rtu = value;
    this.arrangeAllBopsChildren();
  }
  get rtu() {
    return this._rtu;
  }

  @Input() children!: any[];
  @Input() i!: number;

  constructor(private store: Store<AppState>) {}

  arrangeAllBopsChildren() {
    this.collectionOfChildren = [];
    for (const bop of this._rtu.bops) {
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
          const freePort = new PortOfOtau();
          freePort.otauId = bop.bopId;
          freePort.otauSerial = bop.serial;
          freePort.otauNetAddress = bop.bopNetAddress;
          freePort.rtuId = rtu.rtuId;
          freePort.isPortOnMainCharon = false;
          freePort.opticalPort = i + 1;
          freePort.mainCharonPort = bop.masterPort;
          const child = { type: 'free-port', port: i + 1, payload: freePort };
          oneBopChildren.push(child);
        }
      }
      this.collectionOfChildren.push(oneBopChildren);
    }
  }
}
