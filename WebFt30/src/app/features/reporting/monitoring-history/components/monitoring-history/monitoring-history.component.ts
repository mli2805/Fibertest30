import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  AppState,
  HighlightNavigationService,
  MonitoringHistoryActions,
  MonitoringHistorySelectors,
  OtausSelectors,
  UsersSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { MonitoringResult, OtauPortPath } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { takeUntil } from 'rxjs';
import { OnAttach } from 'src/app/app-route-reuse-strategy';

@Component({
  selector: 'rtu-monitoring-history',
  templateUrl: 'monitoring-history.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringHistoryComponent
  extends OnDestroyBase
  implements OnInit, AfterViewInit, OnAttach
{
  convertUtils = ConvertUtils;
  monitoringHistoryActions = MonitoringHistoryActions;

  private store: Store<AppState> = inject(Store<AppState>);
  loading$ = this.store.select(MonitoringHistorySelectors.selectLoading);
  loadedTime$ = this.store.select(MonitoringHistorySelectors.selectLoadedTime);
  errorMessageId$ = this.store.select(MonitoringHistorySelectors.selectErrorMessageId);
  monitorings$ = this.store.select(MonitoringHistorySelectors.selectMonitorings);

  private monitoringPortIds: number[] = [];
  orderDescending = true;
  scrollOffset = 0;

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  constructor(private router: Router, public higlightService: HighlightNavigationService) {
    super();
  }

  ngOnInit(): void {
    this.loadIfNotLoadedBefore();
  }

  ngAfterViewInit(): void {
    this.viewport
      .elementScrolled()
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe(() => {
        this.scrollOffset = this.viewport.measureScrollOffset();
      });
  }

  onAttach() {
    this.viewport.scrollToOffset(this.scrollOffset, 'auto');
    this.higlightService.resetMonitoringHistoryMonitoringId();
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

  refresh() {
    this.doRefresh();
  }

  onFilterChanged(selected: any) {
    this.monitoringPortIds = selected.selectedPorts.map((p: OtauPortPath) => p.monitoringPortId);
    this.refresh();
  }

  onOrderChanged() {
    this.orderDescending = !this.orderDescending;
    this.refresh();
  }

  trackById(index: number, item: MonitoringResult): number {
    return item.id;
  }

  loadNextPage(lastLoadedMonitoring: MonitoringResult) {
    this.store.dispatch(
      MonitoringHistoryActions.loadNextMonitorings({
        monitoringPortIds: this.monitoringPortIds,
        orderDescending: this.orderDescending,
        lastMonitoringDateTime: lastLoadedMonitoring.completedAt
      })
    );
  }

  private loadIfNotLoadedBefore() {
    const monitorings = CoreUtils.getCurrentState(
      this.store,
      MonitoringHistorySelectors.selectMonitorings
    );
    if (monitorings === null) {
      this.doRefresh();
    }
  }

  private doRefresh() {
    this.store.dispatch(
      MonitoringHistoryActions.getMonitorings({
        monitoringPortIds: this.monitoringPortIds,
        orderDescending: this.orderDescending
      })
    );
  }

  async saveTraceAndBase(monitoringResult: MonitoringResult) {
    this.store.dispatch(
      MonitoringHistoryActions.saveTraceAndBase({
        monitoringId: monitoringResult.id,
        monitoringPortId: monitoringResult!.monitoringPortId,
        at: monitoringResult!.completedAt
      })
    );
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
