import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { RtuTreeService } from 'src/app/core/grpc/services/rtu-tree.service';
import { TreeMapping } from 'src/app/core/store/mapping/tree-mapping';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
  selector: 'rtu-rtu-tree',
  templateUrl: './rtu-tree.component.html'
})
export class RtuTreeComponent {
  rtus!: Rtu[] | null;
  collectionOfChildren!: any[];

  constructor(private store: Store<AppState>, private rtuTreeService: RtuTreeService) {
    this.rtus = CoreUtils.getCurrentState(store, RtuTreeSelectors.selectRtuArray);
    if (!this.rtus) this.loadRtus();
    this.collectionOfChildren = [];
    for (const rtu of this.rtus!) {
      this.arrangeRtuChildren(rtu);
    }
  }

  async loadRtus(): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.rtuTreeService.refreshRtuTree());
      this.rtus = response.rtus.map((r) => TreeMapping.fromGrpcRtu(r));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  arrangeRtuChildren(rtu: Rtu) {
    const children = [];
    for (let i = 0; i < rtu.ownPortCount; i++) {
      const bop = rtu.bops.find((b) => b.masterPort === i + 1);
      if (bop !== undefined) {
        const child = { type: 'bop', port: i + 1, payload: bop };
        children.push(child);
        continue;
      }
      const trace = rtu.traces.find((t) => t.port !== null && t.port.opticalPort === i + 1);
      if (trace !== undefined) {
        const child = { type: 'attached-trace', port: i + 1, payload: trace };
        children.push(child);
        continue;
      }
      const freePort = new PortOfOtau();
      freePort.rtuId = rtu.rtuId;
      freePort.otauSerial = rtu.serial!; // порты есть только у инициализированного рту
      freePort.isPortOnMainCharon = true;
      freePort.opticalPort = i + 1;
      const child = { type: 'free-port', port: i + 1, payload: freePort };
      children.push(child);
    }

    for (const trace of rtu.traces) {
      if (trace.port === null) {
        const child = { type: 'detached-trace', port: -1, payload: trace };
        children.push(child);
      }
    }

    this.collectionOfChildren.push(children);
  }
}
