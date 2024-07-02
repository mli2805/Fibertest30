import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, BaselineSetupActions, BaselineSetupSelectors } from 'src/app/core';
import { MeasurementSettings } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-baseline-manual-setup-button',
  template: `
    <rtu-otdr-task-button
      [canStart]="measurementSettings?.isValid ?? false"
      [size]="'normal'"
      [startButtonImage]="'normal'"
      [startButtonMessageId]="'i18n.baseline.measure-baseline'"
      [stopButtonMessageId]="'i18n.common.stop-test'"
      [showStart$]="showStart$"
      [starting$]="starting$"
      [started$]="started$"
      [cancelling$]="cancelling$"
      (startClicked)="start()"
      (stopClicked)="stop()"
    >
    </rtu-otdr-task-button>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineManualSetupButtonComponent {
  showStart$!: Observable<boolean>;
  starting$!: Observable<boolean>;
  started$!: Observable<boolean>;
  cancelling$!: Observable<boolean>;

  @Input() measurementSettings: MeasurementSettings | null = null;

  private _monitoringPortId!: number;
  @Input() set monitoringPortId(value: number) {
    this._monitoringPortId = value;
    this.showStart$ = this.store.select(
      BaselineSetupSelectors.selectShowStartById(this._monitoringPortId)
    );
    this.starting$ = this.store.select(
      BaselineSetupSelectors.selectStartingById(this._monitoringPortId)
    );
    this.started$ = this.store.select(
      BaselineSetupSelectors.selectStartedById(this._monitoringPortId)
    );
    this.cancelling$ = this.store.select(
      BaselineSetupSelectors.selectCancellingById(this._monitoringPortId)
    );
  }

  get monitoringPortId() {
    return this._monitoringPortId;
  }

  constructor(public store: Store<AppState>) {}

  start() {
    if (!this.measurementSettings || !this.measurementSettings.isValid) {
      return;
    }
    this.store.dispatch(
      BaselineSetupActions.startBaseline({
        monitoringPortId: this._monitoringPortId,
        fullAutoMode: false,
        measurementSettings: this.measurementSettings
      })
    );
  }

  stop() {
    this.store.dispatch(
      BaselineSetupActions.stopBaseline({ monitoringPortId: this._monitoringPortId })
    );
  }
}
