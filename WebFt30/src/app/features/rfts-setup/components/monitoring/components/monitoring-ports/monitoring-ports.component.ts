import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import {
  Observable,
  combineLatest,
  filter,
  forkJoin,
  from,
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
  MonitoringPortActions,
  MonitoringPortSelectors,
  BaselineSetupActions,
  OtausSelectors,
  OtausActions
} from 'src/app/core';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { MonitoringPort, Otau, OtauPort } from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { RouterSelectedOtauUtils } from '../../utils/router-selected-otau-utils';
import { MonitoringPortStatus } from 'src/grpc-generated';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { CombinedPort } from 'src/app/core/store/models/combined-port';
import { MonitoringSchedule } from 'src/app/core/store/models/monitoring-schedule';
import { ScheduleSelectComponent } from '../schedule-select/schedule-select.component';
import { AlarmProfilesSelectors } from 'src/app/core/store/alarm-profile/alarm-profiles.selectors';
import { AlarmProfile } from 'src/app/core/store/models/alarm-profile';

@Component({
  selector: 'rtu-monitoring-ports',
  templateUrl: 'monitoring-ports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class MonitoringPortsComponent extends OnDestroyBase {
  @ViewChildren('statusSelect') statusSelects!: QueryList<SelectComponent>;
  @ViewChildren('scheduleSelect') scheduleSelects!: QueryList<ScheduleSelectComponent>;

  convertUtils = ConvertUtils;
  monitoringPortStatus = MonitoringPortStatus;

  ocmPortIndex$: Observable<number | null>;
  otau$!: Observable<Otau | null>;
  combinedOtauPorts$!: Observable<CombinedPort[]>;
  expandedTimeSlots$ = this.store.pipe(select(MonitoringPortSelectors.selectExpandedTimeSlots));

  monitoringPortActions = MonitoringPortActions;
  loading$ = this.store.select(MonitoringPortSelectors.selectLoading);
  errorMessageId$ = this.store.select(MonitoringPortSelectors.selectErrorMessageId);

  hasChangeMonitoringPortSettingsPermisson$ = this.store.select(
    AuthSelectors.selectHasChangeMonitoringPortSettingsPermisson
  );

  alarmProfiles$ = this.store.select(AlarmProfilesSelectors.selectAlarmProfilesArray);

  statuses: MonitoringPortStatus[] = [
    MonitoringPortStatus.Off,
    MonitoringPortStatus.On,
    MonitoringPortStatus.Maintenance
  ];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();

    RouterSelectedOtauUtils.restoreSelectionOrNaviagteToDefault(
      this.store,
      this.router,
      this.route
    );

    this.ocmPortIndex$ = this.store.select(RouterSelectors.selectOcmPortIndexParam);

    this.otau$ = this.ocmPortIndex$.pipe(
      takeUntil(this.ngDestroyed$),
      // it's important to filter by null here, to avoid error when navigating to another page
      filter((ocmPortIndex: number | null) => ocmPortIndex !== null),
      switchMap((ocmPortIndex: number | null) => {
        return this.store.select(OtausSelectors.selectOtauByOcmPortIndex(ocmPortIndex!));
      })
    );

    this.errorMessageId$
      .pipe(
        takeUntil(this.ngDestroyed$),
        filter((errorMessageId: string | null) => errorMessageId !== null),
        tap(() => {
          this.resetPage();
        })
      )
      .subscribe();

    this.otau$
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap((otau: Otau | null) => {
          if (otau === null) {
            // it looks like otau was deleted, so let's go to the parent
            // and it will recheck if otau exists and navigate to the default one
            this.router.navigate(['../'], {
              relativeTo: this.route
            });
          } else {
            // reset error when otau is changed
            this.store.dispatch(MonitoringPortActions.resetError());
          }
        })
      )
      .subscribe();

    this.combinedOtauPorts$ = this.otau$.pipe(
      takeUntil(this.ngDestroyed$),
      filter((otau: any) => otau !== null),
      switchMap((otau: Otau) => {
        return this.store.select(MonitoringPortSelectors.selectCombinedOtauPorts(otau));
      })
    );
  }

  getAlarmProfile(
    profiles: AlarmProfile[],
    monitoringPort: MonitoringPort
  ): AlarmProfile | undefined {
    return profiles.find((p) => p.id === monitoringPort.alarmProfileId);
  }

  onPortStatus(monitoringPortId: number, status: MonitoringPortStatus) {
    this.store.dispatch(MonitoringPortActions.setPortStatus({ monitoringPortId, status }));
  }

  resetPage() {
    if (this.statusSelects) {
      this.statusSelects.forEach((select) => {
        select.resetToCurrentSelectedItemInput();
      });
    }

    if (this.scheduleSelects) {
      this.scheduleSelects.forEach((component) => {
        component.restoreWhenSaveFailed();
      });
    }
  }

  onScheduleChanged(monitoringPortId: number, schedule: MonitoringSchedule) {
    this.store.dispatch(MonitoringPortActions.setPortSchedule({ monitoringPortId, schedule }));
  }

  onPortAlarmProfileChanged(monitoringPortId: number, profile: AlarmProfile) {
    this.store.dispatch(
      MonitoringPortActions.setPortAlarmProfile({ monitoringPortId, alarmProfileId: profile.id })
    );
  }

  navigateToOtau(ocmPortIndex: number) {
    this.store.dispatch(
      OtausActions.setRouterSelectedOtauOcmPortIndex({ ocmPortIndex: ocmPortIndex })
    );
    this.router.navigate(['../', ocmPortIndex], {
      relativeTo: this.route
    });
  }
}
