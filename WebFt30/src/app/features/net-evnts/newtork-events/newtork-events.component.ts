import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, NetworkEventsSelectors } from 'src/app/core';
import { NetworkEventsActions } from 'src/app/core/store/network-events/network-events.actions';

@Component({
  selector: 'rtu-newtork-events',
  templateUrl: './newtork-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewtorkEventsComponent {
  networkEventsActions = NetworkEventsActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(NetworkEventsSelectors.selectLoading);
  loadedTime$ = this.store.select(NetworkEventsSelectors.selectLoadedTime);
  networkEvents$ = this.store.select(NetworkEventsSelectors.selectNetworkEvents);
  errorMessageId$ = this.store.select(NetworkEventsSelectors.selectErrorMessageId);

  constructor() {
    this.refresh();
  }

  checked = true;
  onToggle() {
    this.checked = !this.checked;
    this.refresh();
  }

  refresh() {
    this.store.dispatch(NetworkEventsActions.getNetworkEvents({ currentEvents: this.checked }));
  }
}
