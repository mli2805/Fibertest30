import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SorColors, SorTrace } from '@veex/sor';
import { LinkMapBase } from '@veex/link-map';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import {
  AppState,
  AuthSelectors,
  BaselineSetupActions,
  BaselineSetupSelectors,
  DeviceSelectors,
  MonitoringPortActions,
  MonitoringPortSelectors,
  OtdrTaskProgress,
  TestQueueSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { MeasurementService, ReportingService } from 'src/app/core/grpc';
import { MapUtils } from 'src/app/core/map.utils';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { exhaustMapWithTrailing } from 'src/app/core/rxjs.utils';
import {
  MeasurementSettings,
  MonitoringBaseline,
  MonitoringPort,
  MonitoringResult
} from 'src/app/core/store/models';
import { MeasurementSettignsService } from 'src/app/features/shared/measurement/components/measurement-settings/measurement-settings.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { MonitoringPortStatus } from 'src/grpc-generated';

@Component({
  selector: 'rtu-baseline-setup',
  templateUrl: 'baseline-setup.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  // styles: [':host { overflow-y: auto; display: flex; width: 100%; height: 100%; }'],
  providers: [MeasurementSettignsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineSetupComponent extends OnDestroyBase implements OnInit {
  statuses = MonitoringPortStatus;

  setNewBaseline = false;
  fullScreen = false;
  linkMapMode = false;

  monitoringPort: MonitoringPort | null = null;
  baseline: MonitoringBaseline | null = null;
  baselineTrace: SorTrace | null = null;
  baselineLinkmap: LinkMapBase | null = null;

  lastMonitoring: MonitoringResult | null = null;
  lastMonitoringTrace: SorTrace | null = null;
  lastMonitoringLinkmap: LinkMapBase | null = null;

  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);

  monitoringPortId$: Observable<number | null>;

  showStart$: Observable<boolean>;
  progress$: Observable<OtdrTaskProgress | null>;
  lastProgressSorTrace$: Observable<SorTrace | null>;

  supportedMeasurementParameters$ = this.store.select(
    DeviceSelectors.selectSupportedMeasurementParameters
  );

  hasChangeMonitoringPortSettingsPermisson$ = this.store.select(
    AuthSelectors.selectHasChangeMonitoringPortSettingsPermisson
  );

  measurementSettings$: Observable<MeasurementSettings | null>;

  constructor(
    private store: Store<AppState>,
    private measurementSettingsService: MeasurementSettignsService,
    private reporting: ReportingService,
    private measurementService: MeasurementService,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.supportedMeasurementParameters$
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((x) => x !== null)
      )
      .subscribe((supportedMeasurementParameters) => {
        this.measurementSettingsService.setSupportedMeasurementParameters(
          supportedMeasurementParameters!
        );
      });

    this.measurementSettings$ = this.measurementSettingsService.measurementSettings$;

    this.monitoringPortId$ = this.store.select(RouterSelectors.selectMonitoringPortIdParam).pipe(
      takeUntil(this.ngDestroyed$),
      filter((x) => x !== null)
    );

    this.monitoringPortId$
      .pipe(
        switchMap((monitoringPortId) => {
          return this.store
            .select(
              TestQueueSelectors.selectLastCompletedMonitoringProgressByMonitoringPortId(
                monitoringPortId!
              )
            )
            .pipe(
              takeUntil(this.ngDestroyed$),
              filter((progress) => progress !== null && this.baseline !== null),
              switchMap((progress) => {
                return this.loadLastMonitoring(monitoringPortId!, this.baseline!.id);
              })
            );
        })
      )
      .subscribe();

    this.showStart$ = this.monitoringPortId$.pipe(
      switchMap((monitoringPortId) => {
        return this.store.select(BaselineSetupSelectors.selectShowStartById(monitoringPortId!));
      })
    );

    this.progress$ = this.monitoringPortId$.pipe(
      switchMap((monitoringPortId) => {
        return this.store.select(BaselineSetupSelectors.selectProgressById(monitoringPortId!));
      })
    );

    this.lastProgressSorTrace$ = this.progress$.pipe(
      // exhaustMapWithTrailing to handle the last progress which is completed/cancelled/failed
      // and set lastProgressSorTrace$ to null
      exhaustMapWithTrailing((progress: OtdrTaskProgress | null) => {
        if (progress === null || progress.status !== 'running') {
          return of(null);
        }

        return this.measurementService.getBaselineProgressTrace(progress!.otdrTaskId).pipe(
          filter(({ sor }) => !!sor && sor.length > 0),
          map(({ sor }) => sor),
          catchError(() => {
            // don't care if there is an error getting progress trace
            // just keep showing the previous
            return EMPTY;
          })
        );
      }),
      switchMap((sor: Uint8Array | null) => {
        return ConvertUtils.buildSorTrace(sor, SorColors.Baseline);
      })
    );
  }

  async ngOnInit() {
    this.store
      .select(MonitoringPortSelectors.selectMonitoringPortByRouteMonitoringPortId)
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((x) => x !== null),
        tap((monitoringPort) => {
          this.monitoringPort = monitoringPort;
          this.cdr.markForCheck();
        }),
        distinctUntilChanged((prev, curr) => prev?.baseline?.id === curr?.baseline?.id)
      )
      .subscribe(() => {
        this.goToMonitoringPort();
      });
  }

  goToMonitoringPort() {
    if (this.monitoringPort?.baseline) {
      this.loadAll(this.monitoringPort.id, this.monitoringPort.baseline.id).then(() => {
        this.setNewBaseline = false;
      });
    } else {
      this.baseline = null;
      this.baselineTrace = null;
      this.setNewBaseline = true;
      this.measurementSettingsService.setAutoMode(true);
      if (this.fullScreen) {
        this.toggleFullScreen();
      }
    }
  }

  async loadAll(monitoringPortId: number, baselineId: number) {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    forkJoin({
      baseline: this.loadBaseline(baselineId),
      lastMonitoring: this.loadLastMonitoring(monitoringPortId, baselineId)
    })
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap(() => this.loading$.next(false))
      )
      .subscribe();
  }

  loadBaseline(baselineId: number) {
    return forkJoin({
      baseline: this.reporting.getBaseline(baselineId).pipe(
        map((response) => MapUtils.toMonitoringBaseline(response.baseline!)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-baseline');
          return of(null);
        })
      ),
      baselineTrace: this.reporting.getBaselineTrace(baselineId).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor, SorColors.Baseline)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-baseline-trace');
          return of(null);
        })
      ),
      baselineLinkmap: this.reporting.getBaselineLinkmap(baselineId).pipe(
        mergeMap(async ({ lmap }) => ConvertUtils.buildLinkMap(lmap)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-baseline-lmap');
          return of(null);
        })
      )
    }).pipe(
      tap(({ baseline, baselineTrace, baselineLinkmap }) => {
        this.baseline = baseline;
        this.baselineTrace = baselineTrace;
        this.baselineLinkmap = baselineLinkmap;
        this.measurementSettingsService.setMeasurementSettings(baseline!.measurementSettings);
      })
    );
  }

  loadLastMonitoring(monitoringPortId: number, baselineId: number) {
    return forkJoin({
      lastMonitoring: this.reporting.getLastMonitoring(monitoringPortId, baselineId).pipe(
        map((response) => {
          return response.monitoring ? MapUtils.toMonitoringResult(response.monitoring) : null;
        }),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-last-monitoring');
          return of(null);
        })
      ),
      lastMonitoringTrace: this.reporting.getLastMonitoringTrace(monitoringPortId, baselineId).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-last-monitoring-trace');
          return of(null);
        })
      ),
      lastMonitoringLinkmap: this.reporting.getLastMonitoringLinkmap(monitoringPortId, baselineId).pipe(
        mergeMap(async ({ lmap }) => ConvertUtils.buildLinkMap(lmap)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-last-monitoring-lmap');
          return of(null);
        })
      )
    }).pipe(
      takeUntil(this.ngDestroyed$),
      tap(({ lastMonitoring, lastMonitoringTrace, lastMonitoringLinkmap }) => {
        this.lastMonitoring = lastMonitoring;
        this.lastMonitoringTrace = lastMonitoringTrace;
        this.lastMonitoringLinkmap = lastMonitoringLinkmap;
        this.cdr.markForCheck();
      })
    );
  }

  saveSor() {
    if (!this.baseline) {
      return;
    }

    this.store.dispatch(
      BaselineSetupActions.saveTrace({
        baselineId: this.baseline.id,
        monitoringPortId: this.baseline.monitoringPortId,
        at: this.baseline.createdAt
      })
    );
  }

  toggleFullScreen() {
    this.fullScreen = !this.fullScreen;
  }

  toggleSetNewBaseline() {
    this.setNewBaseline = !this.setNewBaseline;
    if (this.setNewBaseline && this.fullScreen) {
      this.toggleFullScreen();
    }
  }

  toggleMaintainace() {
    const status =
      this.monitoringPort?.status !== MonitoringPortStatus.Maintenance
        ? MonitoringPortStatus.Maintenance
        : MonitoringPortStatus.Off;

    this.store.dispatch(
      MonitoringPortActions.setPortStatus({ monitoringPortId: this.monitoringPort!.id, status })
    );

    // if (this.monitoringPort) {
    //   this.monitoringPort.status = status;
    // }
  }

  toggleMonitoring() {
    const status =
      this.monitoringPort?.status !== MonitoringPortStatus.On
        ? MonitoringPortStatus.On
        : MonitoringPortStatus.Off;

    this.store.dispatch(
      MonitoringPortActions.setPortStatus({ monitoringPortId: this.monitoringPort!.id, status })
    );

    // if (this.monitoringPort) {
    //   this.monitoringPort.status = status;
    // }
  }
}
