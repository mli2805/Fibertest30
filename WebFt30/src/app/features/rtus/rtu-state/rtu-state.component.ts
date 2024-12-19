import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { BaseRefType, FiberState, RtuPartState } from 'src/app/core/store/models/ft30/ft-enums';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

export interface PortInTable {
  port: string;
  title: string;
  state: FiberState | null;
  sorFileId: number;
  registeredAt: Date | null;
}

@Component({
  selector: 'rtu-rtu-state',
  templateUrl: './rtu-state.component.html',
  styleUrls: ['./rtu-state.component.css']
})
export class RtuStateComponent implements OnInit {
  rtuPartState = RtuPartState;
  baseRefType = BaseRefType;
  rtuId!: string;

  public store: Store<AppState> = inject(Store);

  rtu$;
  subscription!: Subscription;

  portTable$ = new BehaviorSubject<PortInTable[] | null>(null);

  constructor(private route: ActivatedRoute, private ts: TranslateService) {
    this.rtuId = this.route.snapshot.paramMap.get('id')!;
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(this.rtuId));
  }

  ngOnInit(): void {
    // если состояние трассы изменяется, то приходит событие и идет вычитывание рту
    // значит запустится обновление таблицы
    this.subscription = this.store
      .select(RtuTreeSelectors.selectRtu(this.rtuId))
      .subscribe((rtu) => {
        if (rtu) this.updateTable(rtu);
      });
  }

  updateTable(rtu: Rtu) {
    console.log(rtu);

    let res = new Array<PortInTable>();
    for (let i = 0; i < rtu.ownPortCount; i++) {
      const child = rtu.children[i];
      // prettier-ignore
      switch (child.type) {
        case 'free-port':
          res.push({ port: child.port, title: this.ts.instant("i18n.ft.no").toLowerCase(), state: null, sorFileId: -1, registeredAt: null });
          break;

        case 'attached-trace':
          res.push({ port: child.port, title: child.payload.title, state: child.payload.state,
            sorFileId: -1, registeredAt: null });
          break;

        case 'bop':
          res = res.concat(this.getBopChildren(child.payload));
          break;
        case 'detached-trace':
          break;
      }
    }

    this.portTable$.next(res);
  }

  getBopChildren(bop: Bop): PortInTable[] {
    const res = new Array<PortInTable>();
    for (let i = 0; i < bop.children.length; i++) {
      const child = bop.children[i];
      const portOnBop = `${bop.masterPort}-${child.port}`;
      // prettier-ignore
      switch (child.type) {
        case 'free-port':
          res.push({ port: portOnBop, title: this.ts.instant("i18n.ft.no").toLowerCase(), state: null, sorFileId: -1, registeredAt: null });
          break;

        case 'attached-trace':
          res.push({ port: portOnBop, title: child.payload.title, state: child.payload.state,
            sorFileId: -1, registeredAt: null });
          break;
      }
    }
    console.log(res);
    return res;
  }
}
