import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom, Observable, Subscription } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import {
  BaseRefType,
  FiberState,
  MonitoringCurrentStep,
  RtuPartState
} from 'src/app/core/store/models/ft30/ft-enums';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { GetRtuCurrentStepResponse } from 'src/grpc-generated';
import { TranslateService } from '@ngx-translate/core';
import { RtuTreeService } from 'src/app/core/grpc';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';

export interface PortInTable {
  port: string;
  title: string;
  state: FiberState | null;
  baseRefType: BaseRefType;
  sorFileId: number;
  registeredAt: Date | null;
}

@Component({
    selector: 'rtu-rtu-state-window',
    templateUrl: './rtu-state-window.component.html',
    standalone: false
})
export class RtuStateWindowComponent implements OnInit, OnDestroy {
  rtuPartState = RtuPartState;
  baseRefType = BaseRefType;
  public store: Store<AppState> = inject(Store);

  @Input() rtuId!: string;
  @Input() zIndex!: number;

  rtu$!: Observable<Rtu | null>;
  subscription!: Subscription;
  private intervalId: any = null;
  portTable$ = new BehaviorSubject<PortInTable[] | null>(null);
  worstPort$ = new BehaviorSubject<PortInTable | null>(null);
  stepLine = '';

  constructor(
    private windowService: WindowService,
    private ts: TranslateService,
    private rtuTreeService: RtuTreeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // если состояние трассы изменяется, то приходит событие и идет вычитывание рту
    // значит запустится обновление таблицы
    this.subscription = this.store
      .select(RtuTreeSelectors.selectRtu(this.rtuId))
      .subscribe((rtu) => {
        if (rtu) this.updateTable(rtu);
      });

    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(this.rtuId));

    this.startPollingStep();
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  updateTable(rtu: Rtu) {
    let res = new Array<PortInTable>();
    for (let i = 0; i < rtu.ownPortCount; i++) {
      const child = rtu.children[i];
      // prettier-ignore
      switch (child.type) {
          case 'free-port':
            res.push({ port: child.port, title: this.ts.instant("i18n.ft.no").toLowerCase(), 
              state: null, baseRefType: BaseRefType.None, sorFileId: -1, registeredAt: null });
            break;
  
          case 'attached-trace':
            res.push({ port: child.port, title: child.payload.title, state: child.payload.state, baseRefType: child.payload.baseRefType,
              sorFileId: child.payload.sorFileId, registeredAt: child.payload.registeredAt });
            break;
  
          case 'bop':
            res = res.concat(this.getBopChildren(child.payload));
            break;
          case 'detached-trace':
            break;
        }
    }

    const onlyTraces = res.filter((l) => l.state !== null);
    if (onlyTraces.length > 0) {
      const worst = onlyTraces.reduce((acc, value) => {
        return (acc = acc.state! > value.state! ? acc : value);
      });
      this.worstPort$.next(worst);
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
            res.push({ port: portOnBop, title: this.ts.instant("i18n.ft.no").toLowerCase(), 
              state: null, baseRefType: BaseRefType.None, sorFileId: -1, registeredAt: null });
            break;
  
          case 'attached-trace':
            res.push({ port: portOnBop, title: child.payload.title, state: child.payload.state, baseRefType: child.payload.baseRefType,
              sorFileId: child.payload.sorFileId, registeredAt: child.payload.registeredAt });
            break;
        }
    }
    return res;
  }

  async startPollingStep() {
    this.stepLine = this.ts.instant('i18n.ft.waiting-for-data');
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

  close() {
    this.windowService.unregisterWindow(this.rtuId, 'RtuState');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
