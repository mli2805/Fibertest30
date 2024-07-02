import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, BaselineSetupActions, BaselineSetupSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-baseline-auto-setup-button',
  template: `
    <rtu-otdr-task-button
      [size]="'small'"
      [startButtonImage]="'no-circle'"
      [startButtonMessageId]="'i18n.baseline.auto-baseline'"
      [startButtonMessageNoWrap]="true"
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
export class BaselineAutoSetupButtonComponent {
  showStart$!: Observable<boolean>;
  starting$!: Observable<boolean>;
  started$!: Observable<boolean>;
  cancelling$!: Observable<boolean>;

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
    this.store.dispatch(
      BaselineSetupActions.startBaseline({
        monitoringPortId: this._monitoringPortId,
        fullAutoMode: true,
        measurementSettings: null
      })
    );
  }

  stop() {
    this.store.dispatch(
      BaselineSetupActions.stopBaseline({ monitoringPortId: this._monitoringPortId })
    );
  }
}
