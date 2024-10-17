import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OpticalEventsActions, OpticalEventsSelectors } from 'src/app/core';
import { EventStatus, FiberState } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
  selector: 'rtu-optical-events',
  templateUrl: './optical-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpticalEventsComponent {
  opticalEventsActions = OpticalEventsActions;

  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(OpticalEventsSelectors.selectLoading);
  loadedTime$ = this.store.select(OpticalEventsSelectors.selectLoadedTime);
  opticalEvents$ = this.store.select(OpticalEventsSelectors.selectOpticalEvents);
  errorMessageId$ = this.store.select(OpticalEventsSelectors.selectErrorMessageId);

  fiberStates = FiberState;
  eventStatuses = EventStatus;

  constructor() {
    this.refresh();
  }

  checked = true;
  onToggle() {
    this.checked = !this.checked;
    this.refresh();
  }

  refresh() {
    this.store.dispatch(OpticalEventsActions.getOpticalEvents({ currentEvents: this.checked }));
  }
}
