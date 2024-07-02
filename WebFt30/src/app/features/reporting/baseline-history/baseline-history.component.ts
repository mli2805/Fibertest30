import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, LocalStorageService, OtausSelectors, UsersSelectors } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { BaselineHistoryActions } from 'src/app/core/store/baseline-history/baseline-history.actions';
import { BaselineHistorySelectors } from 'src/app/core/store/baseline-history/baseline-history.selectors';
import { MonitoringBaseline, OtauPortPath } from 'src/app/core/store/models';
import { BACK_TO_BASELINE_HISTORY } from './baseline-view/baseline-view.component';
import { filter, takeUntil, tap } from 'rxjs';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

@Component({
  selector: 'rtu-baseline-history',
  templateUrl: './baseline-history.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineHistoryComponent extends OnDestroyBase implements AfterViewInit, OnDestroy {
  baselineHistoryActions = BaselineHistoryActions;
  convertUtils = ConvertUtils;

  private store: Store<AppState> = inject(Store<AppState>);
  loading$ = this.store.select(BaselineHistorySelectors.selectLoading);
  loadedTime$ = this.store.select(BaselineHistorySelectors.selectLoadedTime);
  errorMessageId$ = this.store.select(BaselineHistorySelectors.selectErrorMessageId);
  baselines$ = this.store.select(BaselineHistorySelectors.selectBaselines);

  backToBaselineId = 0;

  constructor(private router: Router, private localStorageService: LocalStorageService) {
    super();

    this.backToBaselineId = localStorageService.getItem(BACK_TO_BASELINE_HISTORY) || 0;
    this.loadIfNotLoadedOrEmpty();
  }

  ngAfterViewInit(): void {
    this.scrollBack();
  }

  private loadIfNotLoadedOrEmpty() {
    const baselines = CoreUtils.getCurrentState(
      this.store,
      BaselineHistorySelectors.selectBaselines
    );
    if (!baselines || baselines.length === 0) {
      this.reload();
    }
  }

  reload() {
    this.store.dispatch(
      BaselineHistoryActions.getBaselines({ monitoringPortIds: this.monitoringPortIds })
    );
  }

  private monitoringPortIds: number[] = [];
  onFilterChanged(selected: any) {
    this.monitoringPortIds = selected.selectedPorts.map((p: OtauPortPath) => p.monitoringPortId);
    this.store.dispatch(
      BaselineHistoryActions.getBaselines({ monitoringPortIds: this.monitoringPortIds })
    );
    this.reload();
  }

  scrollBack() {
    this.baselines$
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((baselines) => baselines !== null),
        filter((backToBaselineId) => this.backToBaselineId !== 0),
        tap((baselines) => {
          setTimeout(() => {
            this.scrollToEvent(this.backToBaselineId);
          }, 1);
        })
      )
      .subscribe();
  }

  private scrollToEvent(baselineId: number) {
    const element = document.getElementById(baselineId.toString());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toPortDashboard(baseline: MonitoringBaseline) {
    const otauPortPath = this.getOtauPortPathByMonitoringPortId(baseline.monitoringPortId);
    if (otauPortPath === null) return;
    let otauNumber = 0;
    if (otauPortPath.cascadePort !== null) {
      otauNumber = otauPortPath.ocmPort.portIndex;
    }
    const portDashboardPath = `rfts-setup/monitoring/ports/${otauNumber}/dashboard/${baseline.monitoringPortId}`;

    this.router.navigate([portDashboardPath]);
  }

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  getUserById(userId: string) {
    return CoreUtils.getCurrentState(this.store, UsersSelectors.selectUserById(userId));
  }

  saveBase(baselineId: number) {
    const baselines = CoreUtils.getCurrentState(
      this.store,
      BaselineHistorySelectors.selectBaselines
    );

    if (!baselines) {
      return;
    }

    const baseline = baselines.find((b) => b.id === baselineId);

    this.store.dispatch(
      BaselineHistoryActions.saveBase({
        baselineId: baselineId,
        monitoringPortId: baseline!.monitoringPortId,
        at: baseline!.createdAt
      })
    );
  }
}
