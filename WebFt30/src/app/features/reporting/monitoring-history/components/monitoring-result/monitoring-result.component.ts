import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SorColors, SorTrace } from '@veex/sor';
import { LinkMapBase } from '@veex/link-map';
import {
  BehaviorSubject,
  catchError,
  filter,
  firstValueFrom,
  forkJoin,
  mergeMap,
  of,
  takeUntil,
  tap
} from 'rxjs';
import {
  AppState,
  LocalStorageService,
  MonitoringHistoryActions,
  OtausSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { ReportingService } from 'src/app/core/grpc';
import { MapUtils } from 'src/app/core/map.utils';
import { MonitoringResult } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { TRACE_FULL_SCREEN_KEY } from '../../../on-demand-history/components/completed-on-demand/completed-on-demand.component';
import { SorResultBaselineComponent } from 'src/app/features/fiberizer-core/components/viewer-providers';

@Component({
  selector: 'rtu-monitoring-result',
  templateUrl: 'monitoring-result.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringResultComponent extends OnDestroyBase implements OnInit {
  @ViewChild(SorResultBaselineComponent) resultBaselineComponent!: SorResultBaselineComponent;

  convertUtils = ConvertUtils;
  sorColors = SorColors;

  fullScreen = false;
  linkMapMode = false;
  monitoringId!: number;

  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);
  monitoring: MonitoringResult | null = null;
  monitoringTrace: SorTrace | null = null;
  monitoringLinkmap: LinkMapBase | null = null;
  baselineTrace: SorTrace | null = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private reporting: ReportingService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    super();

    this.fullScreen = this.localStorageService.getItem(TRACE_FULL_SCREEN_KEY) || false;
  }

  async ngOnInit() {
    this.monitoringId = +this.route.snapshot.paramMap.get('id')!;
    await this.load();
  }

  async load() {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    try {
      const monitoringResponse = await firstValueFrom(
        this.reporting.getMonitoring(this.monitoringId)
      );
      const monitoring = MapUtils.toMonitoringResult(monitoringResponse.monitoring!);
      this.monitoring = monitoring;
    } catch (error) {
      this.errorMessageId$.next('i18n.monitoring-result.cant-load-monitoring');
      return;
    }

    forkJoin({
      monitoringTrace: this.reporting.getMonitoringTrace(this.monitoringId).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.monitoring-result.cant-load-monitoring-trace');
          return of(null);
        })
      ),
      monitoringLinkmap: this.reporting.getMonitoringLinkmap(this.monitoringId).pipe(
        mergeMap(async ({ lmap }) => ConvertUtils.buildLinkMap(lmap)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.monitoring-result.cant-load-monitoring-lmap');
          return of(null);
        })
      ),
      baselineTrace: this.reporting.getBaselineTrace(this.monitoring.baselineId).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor, SorColors.Baseline)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-baseline-trace');
          return of(null);
        })
      )
    })
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap(() => this.loading$.next(false)),
        tap(({ monitoringTrace, monitoringLinkmap, baselineTrace }) => {
          this.monitoringTrace = monitoringTrace;
          this.monitoringLinkmap = monitoringLinkmap;
          this.baselineTrace = baselineTrace;
        })
      )
      .subscribe();
  }

  async saveSor() {
    if (!this.monitoring) {
      return;
    }

    this.store.dispatch(
      MonitoringHistoryActions.saveTraceAndBase({
        monitoringId: this.monitoringId,
        monitoringPortId: this.monitoring.monitoringPortId,
        at: this.monitoring.completedAt
      })
    );
  }

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  toggleFullScreen() {
    this.fullScreen = !this.fullScreen;
    this.localStorageService.setItem(TRACE_FULL_SCREEN_KEY, this.fullScreen);
  }

  clickBaselineDetails(keyEventIndex: number) {
    this.resultBaselineComponent.clickBaseline();
    this.selectEventByKeyEventIndex(keyEventIndex);
  }

  clickMeasurementDetails(keyEventIndex: number) {
    this.resultBaselineComponent.clickMeasurement();
    this.selectEventByKeyEventIndex(keyEventIndex);
  }

  selectEventByKeyEventIndex(keyEventIndex: number) {
    this.resultBaselineComponent.selectEventByKeyEventIndex(keyEventIndex);
  }

  toPortDashboard(monitoring: MonitoringResult) {
    const otauPortPath = this.getOtauPortPathByMonitoringPortId(monitoring.monitoringPortId);
    if (otauPortPath === null) return;
    let otauNumber = 0;
    if (otauPortPath.cascadePort !== null) {
      otauNumber = otauPortPath.ocmPort.portIndex;
    }
    const portDashboardPath = `rfts-setup/monitoring/ports/${otauNumber}/dashboard/${monitoring.monitoringPortId}`;

    this.router.navigate([portDashboardPath]);
  }
}
