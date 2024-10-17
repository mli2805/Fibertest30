import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, BopEventsActions, BopEventsSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-bop-network-events',
  templateUrl: './bop-network-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BopNetworkEventsComponent {
  bopEventsActions = BopEventsActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(BopEventsSelectors.selectLoading);
  loadedTime$ = this.store.select(BopEventsSelectors.selectLoadedTime);
  bopEvents$ = this.store.select(BopEventsSelectors.selectBopEvents);
  errorMessageId$ = this.store.select(BopEventsSelectors.selectErrorMessageId);

  constructor() {
    this.refresh();
  }

  checked = true;
  onToggle() {
    this.checked = !this.checked;
    this.refresh();
  }

  refresh() {
    this.store.dispatch(BopEventsActions.getBopEvents({ currentEvents: this.checked }));
  }
}
