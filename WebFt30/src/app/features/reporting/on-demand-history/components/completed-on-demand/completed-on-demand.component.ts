import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SorTrace } from '@veex/sor';
import { LinkMapBase } from '@veex/link-map';
import {
  BehaviorSubject,
  catchError,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  takeUntil,
  tap
} from 'rxjs';
import {
  AppState,
  LocalStorageService,
  OnDemandActions,
  OnDemandHistoryActions,
  OtausSelectors,
  UsersSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { ReportingService } from 'src/app/core/grpc';
import { MapUtils } from 'src/app/core/map.utils';
import { CompletedOnDemand } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

export const TRACE_FULL_SCREEN_KEY = 'TraceFullScreen';

@Component({
  selector: 'rtu-completed-on-demand',
  templateUrl: 'completed-on-demand.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletedOnDemandComponent extends OnDestroyBase implements OnInit {
  convertUtils = ConvertUtils;

  fullScreen = false;
  linkMapMode = false;
  onDemandId!: string;

  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);
  onDemand: CompletedOnDemand | null = null;
  onDemandTrace: SorTrace | null = null;
  onDemandLinkmap: LinkMapBase | null = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private reportingService: ReportingService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    super();

    this.fullScreen = this.localStorageService.getItem(TRACE_FULL_SCREEN_KEY) || false;
  }

  async ngOnInit() {
    this.onDemandId = this.route.snapshot.paramMap.get('id')!;
    this.higlightOnDemandWnenNavigatingToOnDemandHistory();
    await this.load();
  }

  async load() {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    forkJoin({
      onDemand: this.reportingService.getOnDemand(this.onDemandId).pipe(
        map((response) => MapUtils.toCompletedOnDemand(response.onDemand!)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.completed-on-demand.cant-load-on-demand');
          return of(null);
        })
      ),
      onDemandTrace: this.reportingService.getOnDemandTrace(this.onDemandId).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.completed-on-demand.cant-load-on-demand-trace');
          return of(null);
        })
      ),
      onDemandLinkmap: this.reportingService.getOnDemandLinkmap(this.onDemandId).pipe(
        mergeMap(async ({ lmap }) => ConvertUtils.buildLinkMap(lmap)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.completed-on-demand.cant-load-on-demand-lmap');
          return of(null);
        })
      )
    })
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap(() => this.loading$.next(false)),
        tap(({ onDemand, onDemandTrace, onDemandLinkmap }) => {
          this.onDemand = onDemand;
          this.onDemandTrace = onDemandTrace;
          this.onDemandLinkmap = onDemandLinkmap;
        })
      )
      .subscribe();
  }

  async saveSor() {
    if (!this.onDemand) {
      return;
    }

    this.store.dispatch(
      OnDemandActions.saveTrace({
        onDemandId: this.onDemandId,
        monitoringPortId: this.onDemand.monitoringPortId,
        at: this.onDemand.completedAt
      })
    );
  }

  higlightOnDemandWnenNavigatingToOnDemandHistory() {
    this.router.events
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((event) => event instanceof NavigationStart),
        filter((event: any) => event.url === `/reporting/on-demand-history`),
        tap((event: NavigationStart) => {
          this.store.dispatch(
            OnDemandHistoryActions.higlightOnDemand({ onDemandId: this.onDemandId })
          );
        })
      )
      .subscribe();
  }

  getUserById(userId: string) {
    return CoreUtils.getCurrentState(this.store, UsersSelectors.selectUserById(userId));
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
}
