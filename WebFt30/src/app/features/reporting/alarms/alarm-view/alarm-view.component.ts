import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SorColors, SorTrace } from '@veex/sor';
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
import {
  MonitoringAlarmEvent,
  MonitoringAlarmLevel,
  MonitoringResult
} from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { TRACE_FULL_SCREEN_KEY } from '../../on-demand-history/components/completed-on-demand/completed-on-demand.component';
import { SorResultBaselineComponent } from 'src/app/features/fiberizer-core/components/viewer-providers';
import { LinkMapBase } from '@veex/link-map';

export const BACK_TO_ALARM_EVENT = 'BackToAlarmEvent';

@Component({
  selector: 'rtu-alarm-view',
  templateUrl: './alarm-view.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmViewComponent extends OnDestroyBase implements OnInit {
  @ViewChild(SorResultBaselineComponent) resultBaselineComponent!: SorResultBaselineComponent;

  convertUtils = ConvertUtils;
  sorColors = SorColors;
  levels = MonitoringAlarmLevel;

  fullScreen = false;
  linkMapMode = false;
  alarmEventId!: number;
  monitoringId!: number;
  alarmEvents!: MonitoringAlarmEvent[];
  selectedAlarmEvent!: MonitoringAlarmEvent;

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
    this.alarmEventId = +this.route.snapshot.paramMap.get('id')!;
    this.onNavigatingBackToAlarmList();
    this.onNavigatingBackBetweenEventsOfAlarm();

    if (!(await this.loadAllAlarmEvents())) return;
    await this.loadMonitoringResultAndItsSorDatas();
  }

  async loadMonitoringResultAndItsSorDatas() {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    if (!(await this.loadMonitoringResult())) return;

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
      baselineTrace: this.reporting.getBaselineTrace(this.monitoring!.baselineId).pipe(
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

  async loadAllAlarmEvents(): Promise<boolean> {
    try {
      const ids: number[] = [];
      const alarmEventsResponse = await firstValueFrom(this.reporting.getAlarmEvents(ids));
      const allAlarmEvents = MapUtils.toAlarmEvents(alarmEventsResponse.alarmEvents!);
      this.selectedAlarmEvent = allAlarmEvents!.find((e) => e.id === this.alarmEventId)!;
      this.monitoringId = this.selectedAlarmEvent.monitoringResultId;

      this.alarmEvents = allAlarmEvents!.filter(
        (e) => e.monitoringAlarmId === this.selectedAlarmEvent.monitoringAlarmId
      );
      return true;
    } catch (error) {
      this.errorMessageId$.next('i18n.alarm-events.cant-load-alarm-events');
      return false;
    }
  }

  async loadMonitoringResult(): Promise<boolean> {
    try {
      const monitoringResponse = await firstValueFrom(
        this.reporting.getMonitoring(this.monitoringId)
      );
      const monitoring = MapUtils.toMonitoringResult(monitoringResponse.monitoring!);
      this.monitoring = monitoring;
      return true;
    } catch (error) {
      this.errorMessageId$.next('i18n.monitoring-result.cant-load-monitoring');
      return false;
    }
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

  // reacts on browser's button back too! AND button goUp in breadcrumbs
  onNavigatingBackToAlarmList() {
    this.router.events
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((event) => event instanceof NavigationStart),
        filter((event: any) => event.url === `/reporting/alarms`),
        tap((event: NavigationStart) => {
          this.localStorageService.setItem(BACK_TO_ALARM_EVENT, this.alarmEventId);
        })
      )
      .subscribe();
  }

  // reacts on browser's button back only. (when several events of one alarm were clicked)
  onNavigatingBackBetweenEventsOfAlarm() {
    const pattern = /^\/reporting\/alarms\/[0-9]+$/;

    this.router.events
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((event) => event instanceof NavigationStart),
        filter((event: any) => pattern.test(event.url)),
        tap((event: NavigationStart) => {
          this.localStorageService.setItem(BACK_TO_ALARM_EVENT, this.alarmEventId);
        })
      )
      .subscribe();
  }

  // navigate to another event of this alarm
  navigateToAlarmEvent(alarmEventId: number) {
    this.localStorageService.setItem(BACK_TO_ALARM_EVENT, alarmEventId);
    this.redirectTo('/reporting/alarms', alarmEventId);
  }

  // When AlarmView is open and we click navigate to another AlarmEvent
  // router thinks route is the same (though id is different!) and does not react
  // So this function redirects to a dummy route and quickly returns to the correct one
  redirectTo(uri: string, id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri, id]);
    });
  }
}
