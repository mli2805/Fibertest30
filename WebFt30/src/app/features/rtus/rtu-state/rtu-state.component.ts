import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom, Subscription } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { RtuTreeService } from 'src/app/core/grpc';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import {
  BaseRefType,
  FiberState,
  MonitoringCurrentStep,
  RtuPartState
} from 'src/app/core/store/models/ft30/ft-enums';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { GetRtuCurrentStepResponse } from 'src/grpc-generated';

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
export class RtuStateComponent implements OnInit, OnDestroy {
  rtuPartState = RtuPartState;
  baseRefType = BaseRefType;
  rtuId!: string;

  private intervalId: any = null;
  stepLine = '';

  public store: Store<AppState> = inject(Store);

  rtu$;
  subscription!: Subscription;

  portTable$ = new BehaviorSubject<PortInTable[] | null>(null);

  constructor(
    private route: ActivatedRoute,
    private ts: TranslateService,
    private rtuTreeService: RtuTreeService,
    private cdr: ChangeDetectorRef
  ) {
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

    this.startPollingStep();
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  updateTable(rtu: Rtu) {
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
    return res;
  }

  async startPollingStep() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      const response = await firstValueFrom(this.rtuTreeService.getRtuCurrentStep(this.rtuId));
      this.stepLine = this.buildLine(response);
      this.cdr.markForCheck();
    }, 2000);
  }

  buildLine(response: GetRtuCurrentStepResponse): string {
    // prettier-ignore
    switch (response.step) {
      case MonitoringCurrentStep.Idle:
        return this.ts.instant('i18n.ft.idle');
      case MonitoringCurrentStep.Toggle:
        return this.ts.instant('i18n.ft.toggle-to-port', response.port);
      case MonitoringCurrentStep.Measure:
        return this.ts.instant('i18n.ft.measurement-on-port-trace', { 0: response.port, 1: response.traceTitle });
      case MonitoringCurrentStep.FailedOtauProblem:
        return this.ts.instant('i18n.ft.measurement-otau-problem', { 0: response.port, 1: response.traceTitle });
      case MonitoringCurrentStep.FailedOtdrProblem:
        return this.ts.instant('i18n.ft.measurement-otdr-problem', { 0: response.port, 1: response.traceTitle });
      case MonitoringCurrentStep.Analysis:
        return this.ts.instant('i18n.ft.measurement-analysis', { 0: response.port, 1: response.traceTitle });
      case MonitoringCurrentStep.Interrupted:
        return this.ts.instant('i18n.ft.measurement-interrupted');
      case MonitoringCurrentStep.MeasurementFinished:
        return this.ts.instant('i18n.ft.measurement-finished', { 0: response.port, 1: response.traceTitle });
      default:
        return this.ts.instant('i18n.ft.unknown');
    }
  }
}
