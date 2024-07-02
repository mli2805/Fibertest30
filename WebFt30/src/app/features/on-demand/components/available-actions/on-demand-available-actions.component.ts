import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, LocalStorageService, OnDemandActions, OnDemandSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { MeasurementSettings } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-on-demand-available-actions',
  templateUrl: 'on-demand-available-actions.component.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDemandAvailableActionsComponent {
  @Input() fullScreen = false;
  @Output() fullScreenChange = new EventEmitter<boolean>();

  linkMapMode = false;

  onDemandStarting$ = this.store.select(OnDemandSelectors.selectStarting);
  onDemandStarted$ = this.store.select(OnDemandSelectors.selectStarted);
  onDemandRunning$ = this.store.select(OnDemandSelectors.selectRunning);
  onDemandCancelling$ = this.store.select(OnDemandSelectors.selectCancelling);
  // onDemandId$ = this.store.select(OnDemandSelectors.selectOtdrTaskId);
  showStart$ = this.store.select(OnDemandSelectors.selectShowStart);
  measurementSettings$ = this.store.select(OnDemandSelectors.selectMeasurementSettings);
  otauPortPath$ = this.store.select(OnDemandSelectors.selectOtauPortPath);
  onDemandCompleted$ = this.store.select(OnDemandSelectors.selectCompleted);

  constructor(private store: Store<AppState>, private localStorageService: LocalStorageService) {}

  startOnDemand(monitoringPortId: number, measurementSettings: MeasurementSettings) {
    if (measurementSettings.isValid) {
      this.store.dispatch(OnDemandActions.startOnDemand({ monitoringPortId, measurementSettings }));
    }
  }

  stopOnDemand() {
    const otdrTaskId = CoreUtils.getCurrentState(this.store, OnDemandSelectors.selectOtdrTaskId);
    if (otdrTaskId !== null) {
      this.store.dispatch(OnDemandActions.stopOnDemand({ otdrTaskId }));
    }
  }

  async saveOnDemandSor() {
    const completed = CoreUtils.getCurrentState(this.store, OnDemandSelectors.selectCompleted);
    const otdrTask = CoreUtils.getCurrentState(this.store, OnDemandSelectors.selectTask);

    if (!completed || otdrTask === null) {
      return;
    }

    this.store.dispatch(
      OnDemandActions.saveTrace({
        onDemandId: otdrTask.otdrTaskId!,
        monitoringPortId: otdrTask.monitoringPortId,
        at: otdrTask.finishedDate!
      })
    );
  }

  toggleFullScreen() {
    this.fullScreenChange.next(!this.fullScreen);
  }
}
