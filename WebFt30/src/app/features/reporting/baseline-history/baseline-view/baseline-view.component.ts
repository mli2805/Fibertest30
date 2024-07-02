import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Store } from '@ngrx/store';
import { LinkMapBase } from '@veex/link-map';
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
import { AppState, LocalStorageService, MonitoringHistoryActions } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { ReportingService } from 'src/app/core/grpc';
import { MapUtils } from 'src/app/core/map.utils';
import { BaselineHistoryActions } from 'src/app/core/store/baseline-history/baseline-history.actions';
import { MonitoringBaseline } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

export const BACK_TO_BASELINE_HISTORY = 'BackToBaselineHistory';

@Component({
  selector: 'rtu-baseline-view',
  templateUrl: './baseline-view.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineViewComponent extends OnDestroyBase implements OnInit {
  convertUtils = ConvertUtils;

  linkMapMode = false;

  baselineId!: number;

  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);
  baseline: MonitoringBaseline | null = null;
  baselineTrace: SorTrace | null = null;
  baselineLinkmap: LinkMapBase | null = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private reporting: ReportingService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    super();
  }

  async ngOnInit() {
    this.baselineId = +this.route.snapshot.paramMap.get('id')!;
    this.onNavigatingBackToBaselineHistory();
    await this.load();
  }

  async load() {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    try {
      const baselineResponse = await firstValueFrom(this.reporting.getBaseline(this.baselineId));
      const baseline = MapUtils.toMonitoringBaseline(baselineResponse.baseline!);
      this.baseline = baseline;
    } catch (error) {
      this.errorMessageId$.next('i18n.baseline.cant-load-baseline');
      return;
    }

    forkJoin({
      baselineTrace: this.reporting.getBaselineTrace(this.baselineId).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor, SorColors.Baseline)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-baseline-trace');
          return of(null);
        })
      ),
      baselineLinkmap: this.reporting.getBaselineLinkmap(this.baselineId).pipe(
        mergeMap(async ({ lmap }) => ConvertUtils.buildLinkMap(lmap)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.baseline.cant-load-baseline-lmap');
          return of(null);
        })
      )
    })
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap(() => this.loading$.next(false)),
        tap(({ baselineTrace, baselineLinkmap }) => {
          this.baselineTrace = baselineTrace;
          this.baselineLinkmap = baselineLinkmap;
        })
      )
      .subscribe();
  }

  saveSor() {
    if (!this.baseline) {
      return;
    }

    this.store.dispatch(
      BaselineHistoryActions.saveBase({
        baselineId: this.baselineId,
        monitoringPortId: this.baseline.monitoringPortId,
        at: this.baseline.createdAt
      })
    );
  }

  // reacts on browser's button back too! AND button goUp in breadcrumbs
  onNavigatingBackToBaselineHistory() {
    this.router.events
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((event) => event instanceof NavigationStart),
        filter((event: any) => event.url === `/reporting/baseline-history`),
        tap((event: NavigationStart) => {
          this.localStorageService.setItem(BACK_TO_BASELINE_HISTORY, this.baselineId);
        })
      )
      .subscribe();
  }
}
