import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, BaselineSetupSelectors, OtdrTaskProgress } from 'src/app/core';

@Component({
  selector: 'rtu-baseline-status',
  template: ` <rtu-task-status
    [titleMessageId]="titleMessageId"
    [progress]="progress$ | async"
    [cancelling]="(cancelling$ | async)!"
    [cancelled]="(cancelled$ | async)!"
    [errorMessageId]="errorMessageId$ | async"
  >
  </rtu-task-status>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineStatusComponent {
  progress$!: Observable<OtdrTaskProgress | null>;
  cancelling$!: Observable<boolean>;
  cancelled$!: Observable<boolean>;
  errorMessageId$!: Observable<string | null>;

  @Input() titleMessageId: string | null = null;
  private _monitoringPortId!: number;
  @Input() set monitoringPortId(value: number) {
    this._monitoringPortId = value;
    this.progress$ = this.store.select(
      BaselineSetupSelectors.selectProgressById(this._monitoringPortId)
    );
    this.cancelling$ = this.store.select(
      BaselineSetupSelectors.selectCancellingById(this._monitoringPortId)
    );
    this.cancelled$ = this.store.select(
      BaselineSetupSelectors.selectCancelledById(this._monitoringPortId)
    );
    this.errorMessageId$ = this.store.select(
      BaselineSetupSelectors.selectErrorMessageIdById(this._monitoringPortId)
    );
  }

  constructor(private store: Store<AppState>) {}
}
