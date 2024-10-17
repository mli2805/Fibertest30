import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState, RtuAccidentsSelectors, RtuAccidentsActions } from 'src/app/core';
import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { RtuAccident } from 'src/app/core/store/models/ft30/rtu-accident';

@Component({
  selector: 'rtu-status-events',
  templateUrl: './status-events.component.html'
})
export class StatusEventsComponent {
  rtuAccidentsActions = RtuAccidentsActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(RtuAccidentsSelectors.selectLoading);
  loadedTime$ = this.store.select(RtuAccidentsSelectors.selectLoadedTime);
  rtuAccidents$ = this.store.select(RtuAccidentsSelectors.selectRtuAccidents);
  errorMessageId$ = this.store.select(RtuAccidentsSelectors.selectErrorMessageId);

  constructor(private ts: TranslateService) {
    this.refresh();
  }

  checked = true;
  onToggle() {
    this.checked = !this.checked;
    this.refresh();
  }

  refresh() {
    this.store.dispatch(RtuAccidentsActions.getRtuAccidents({ currentAccidents: this.checked }));
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
        return this.ts.instant('i18n.ft.cleared-id');
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
        return this.ts.instant('i18n.ft.base-not-found');
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
