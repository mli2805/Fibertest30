import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState, RtuAccidentsSelectors, RtuAccidentsActions } from 'src/app/core';
import { EventTablesService } from 'src/app/core/grpc/services/event-tables.service';
import { HowShowTablesService } from 'src/app/core/services/how-show-tables.service';
import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { RtuAccident } from 'src/app/core/store/models/ft30/rtu-accident';

@Component({
  selector: 'rtu-status-events',
  templateUrl: './status-events.component.html'
})
export class StatusEventsComponent implements OnInit {
  rtuAccidentsActions = RtuAccidentsActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(RtuAccidentsSelectors.selectLoading);
  loadedTime$ = this.store.select(RtuAccidentsSelectors.selectLoadedTime);
  rtuAccidents$ = this.store.select(RtuAccidentsSelectors.selectRtuAccidents);
  errorMessageId$ = this.store.select(RtuAccidentsSelectors.selectErrorMessageId);

  orderDescending!: boolean;
  portionSize: number;

  constructor(
    private ts: TranslateService,
    private ns: HowShowTablesService,
    private et: EventTablesService
  ) {
    this.portionSize = et.portionSize;
  }

  ngOnInit(): void {
    this.currentEvents = this.ns.rtuAccidentsShowCurrent;
    this.orderDescending = this.ns.rtuAccidentsOrderDescending;
    this.refresh();
  }

  currentEvents!: boolean;
  onCurrentEventsToggle() {
    this.currentEvents = !this.currentEvents;
    this.ns.setOne('RtuAccident', this.currentEvents, this.orderDescending, -1);
    this.refresh();
  }

  // function used by `relative-time-refresh` button
  refreshV2() {
    this.refresh();
  }

  loadNextPage(lastLoadedEvent: RtuAccident) {
    this.store.dispatch(
      RtuAccidentsActions.loadNextRtuAccidents({
        currentAccidents: this.currentEvents,
        orderDescending: this.orderDescending,
        lastLoaded: lastLoadedEvent.registeredAt,
        searchWindow: null
      })
    );
  }

  onOrderChanged() {
    this.orderDescending = !this.orderDescending;
    this.refresh();
  }

  refresh() {
    this.store.dispatch(
      RtuAccidentsActions.getRtuAccidents({
        currentAccidents: this.currentEvents,
        orderDescending: this.orderDescending,
        searchWindow: null
      })
    );
  }

  isGoodAccident(rtuAccident: RtuAccident) {
    return (
      rtuAccident.returnCode === ReturnCode.MeasurementEndedNormally ||
      rtuAccident.returnCode === ReturnCode.MeasurementErrorCleared ||
      rtuAccident.returnCode === ReturnCode.MeasurementErrorClearedByInit ||
      rtuAccident.returnCode === ReturnCode.RtuManagerServiceWorking
    );
  }

  getAccidentState(rtuAccident: RtuAccident) {
    switch (rtuAccident.returnCode) {
      case ReturnCode.MeasurementEndedNormally:
        return this.ts.instant('i18n.ft.measurement-ok');
      case ReturnCode.MeasurementErrorCleared:
      case ReturnCode.MeasurementErrorClearedByInit:
        return this.ts.instant('i18n.ft.cleared-id', { 0: rtuAccident.clearedAccidentWithId });
      case ReturnCode.MeasurementBaseRefNotFound:
      case ReturnCode.MeasurementFailedToSetParametersFromBase:
      case ReturnCode.MeasurementAnalysisFailed:
      case ReturnCode.MeasurementComparisonFailed:
        return this.ts.instant('i18n.ft.measurement-failed');
      case ReturnCode.RtuManagerServiceWorking:
        return this.ts.instant('i18n.ft.rtu-ok');
      case ReturnCode.RtuFrequentServiceRestarts:
        return this.ts.instant('i18n.ft.rtu-attention-required');
      default:
        return this.ts.instant('i18n.common.uknwown');
    }
  }

  getAccidentInfo(rtuAccident: RtuAccident) {
    switch (rtuAccident.returnCode) {
      case ReturnCode.MeasurementEndedNormally:
        return this.ts.instant('i18n.ft.measurement-completed-successfully');
      case ReturnCode.MeasurementErrorCleared:
        return this.ts.instant('i18n.ft.status-changed-rtu-substitution-detected');
      case ReturnCode.MeasurementErrorClearedByInit:
        return this.ts.instant('i18n.ft.rtu-re-initialization');
      case ReturnCode.MeasurementBaseRefNotFound:
        return this.ts.instant('i18n.ft.base-not-found', {
          0: this.getBaseName(rtuAccident.baseRefType)
        });
      case ReturnCode.MeasurementFailedToSetParametersFromBase:
        return this.ts.instant('i18n.ft.failed-to-set-parameters-from-base', {
          0: this.getBaseName(rtuAccident.baseRefType)
        });
      case ReturnCode.MeasurementAnalysisFailed:
        return this.ts.instant('i18n.ft.failed-to-analyze');
      case ReturnCode.MeasurementComparisonFailed:
        return this.ts.instant('i18n.ft.failed-to-compare');
      case ReturnCode.RtuManagerServiceWorking:
        return this.ts.instant('i18n.ft.service-is-working');
      case ReturnCode.RtuFrequentServiceRestarts:
        return this.ts.instant('i18n.ft.frequent-service-restarts');
      default:
        return this.ts.instant('i18n.common.uknwown');
    }
  }

  getBaseName(baseRefType: BaseRefType) {
    switch (baseRefType) {
      case BaseRefType.Precise:
        return this.ts.instant('i18n.ft.precise');
      case BaseRefType.Fast:
        return this.ts.instant('i18n.ft.fast');
      case BaseRefType.Additional:
        return this.ts.instant('i18n.ft.additional');
      default:
        return this.ts.instant('i18n.ft.unknonw');
    }
  }
}
