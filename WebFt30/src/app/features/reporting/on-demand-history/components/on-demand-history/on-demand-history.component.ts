import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, withLatestFrom, filter, take, takeUntil, tap } from 'rxjs';
import {
  AppState,
  OnDemandHistoryActions,
  OnDemandHistorySelectors,
  OtausSelectors,
  UsersSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { OtauPortPath } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

@Component({
  selector: 'rtu-on-demand-history',
  templateUrl: 'on-demand-history.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDemandHistoryComponent extends OnDestroyBase implements AfterViewInit, OnDestroy {
  convertUtils = ConvertUtils;
  onDemandHistoryActions = OnDemandHistoryActions;

  private store: Store<AppState> = inject(Store<AppState>);
  loading$ = this.store.select(OnDemandHistorySelectors.selectLoading);
  loadedTime$ = this.store.select(OnDemandHistorySelectors.selectLoadedTime);
  errorMessageId$ = this.store.select(OnDemandHistorySelectors.selectErrorMessageId);
  onDemands$ = this.store.select(OnDemandHistorySelectors.selectOnDemands);
  higlightOnDemandId$ = this.store.select(OnDemandHistorySelectors.selectHiglightOnDemandId);

  constructor() {
    super();

    const higlightOnDemandId = CoreUtils.getCurrentState(
      this.store,
      OnDemandHistorySelectors.selectHiglightOnDemandId
    );

    if (higlightOnDemandId) {
      // if higlightOnDemandId is set, it means we are back from on-demand details page
      // let's not reload onDemands in this case
      this.loadIfNotLoadedOrEmpty();
    } else {
      this.refresh();
    }
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(OnDemandHistoryActions.resetHiglightOnDemand());
  }

  ngAfterViewInit(): void {
    this.scrollToHiglightedOnDemand();
  }

  refresh() {
    // let's reset higlight before user do refresh manually
    this.store.dispatch(OnDemandHistoryActions.resetHiglightOnDemand());
    this.doRefresh();
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

  private loadIfNotLoadedOrEmpty() {
    const onDemands = CoreUtils.getCurrentState(
      this.store,
      OnDemandHistorySelectors.selectOnDemands
    );
    if (!onDemands || onDemands.length === 0) {
      this.doRefresh();
    }
  }

  private doRefresh() {
    this.store.dispatch(
      OnDemandHistoryActions.getOnDemands({ monitoringPortIds: this.monitoringPortIds })
    );
  }

  private monitoringPortIds: number[] = [];
  onFilterChanged(selected: any) {
    this.monitoringPortIds = selected.selectedPorts.map((p: OtauPortPath) => p.monitoringPortId);
    this.refresh();
  }

  private scrollToHiglightedOnDemand() {
    this.onDemands$
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((onDemands) => onDemands !== null),
        withLatestFrom(this.higlightOnDemandId$),
        filter(([onDemands, higlightOnDemandId]) => higlightOnDemandId !== null),
        tap(([onDemands, higlightOnDemandId]) => {
          // setTimeout to make sure that the element is rendered
          setTimeout(() => {
            this.scrollToOnDemand(higlightOnDemandId!);
          }, 1);
        })
      )
      .subscribe();
  }

  private scrollToOnDemand(onDemandId: string) {
    const element = document.getElementById(onDemandId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
