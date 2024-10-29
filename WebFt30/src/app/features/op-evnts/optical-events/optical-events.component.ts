import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OpticalEventsActions, OpticalEventsSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { EventStatus, FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';

@Component({
  selector: 'rtu-optical-events',
  templateUrl: './optical-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpticalEventsComponent implements OnInit {
  opticalEventsActions = OpticalEventsActions;

  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(OpticalEventsSelectors.selectLoading);
  loadedTime$ = this.store.select(OpticalEventsSelectors.selectLoadedTime);
  opticalEvents$ = this.store.select(OpticalEventsSelectors.selectOpticalEvents);
  errorMessageId$ = this.store.select(OpticalEventsSelectors.selectErrorMessageId);

  fiberStates = FiberState;
  eventStatuses = EventStatus;

  orderDescending = true;

  ngOnInit(): void {
    this.loadIfNotLoadedBefore();
  }

  private loadIfNotLoadedBefore() {
    const opticalEvents = CoreUtils.getCurrentState(
      this.store,
      OpticalEventsSelectors.selectOpticalEvents
    );
    if (opticalEvents === null) {
      this.refresh();
    }
  }

  currentEvents = true;
  onCurrentEventsToggle() {
    this.currentEvents = !this.currentEvents;
    this.refresh();
  }

  // function used by `relative-time-refresh` button
  refreshV2() {
    this.refresh();
  }

  onLoadMore() {
    this.opticalEvents$;
  }

  loadNextPage(lastLoadedEvent: OpticalEvent) {
    this.store.dispatch(
      OpticalEventsActions.loadNextOpticalEvents({
        currentEvents: this.currentEvents,
        orderDescending: this.orderDescending,
        lastLoaded: lastLoadedEvent.measuredAt,
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
      OpticalEventsActions.getOpticalEvents({
        currentEvents: this.currentEvents,
        orderDescending: this.orderDescending,
        searchWindow: null
      })
    );
  }
}
