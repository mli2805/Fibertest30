import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OnDemandSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-on-demand-status',
  template: `<rtu-task-status
    [progress]="progress$ | async"
    [cancelling]="(cancelling$ | async)!"
    [cancelled]="(cancelled$ | async)!"
    [errorMessageId]="errorMessageId$ | async"
  >
  </rtu-task-status>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDemandStatusComponent {
  progress$ = this.store.select(OnDemandSelectors.selectProgress);
  cancelling$ = this.store.select(OnDemandSelectors.selectCancelling);
  cancelled$ = this.store.select(OnDemandSelectors.selectCancelled);
  errorMessageId$ = this.store.select(OnDemandSelectors.selectErrorMessageId);

  constructor(private store: Store<AppState>) {}
}
