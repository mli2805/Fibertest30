import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OpticalEventsActions, OpticalEventsSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { EventTablesService } from 'src/app/core/grpc/services/event-tables.service';
import { HowShowTablesService } from 'src/app/core/services/how-show-tables.service';
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

  orderDescending!: boolean;
  portionSize: number;

  constructor(private ns: HowShowTablesService, private et: EventTablesService) {
    this.portionSize = et.portionSize;
  }

  ngOnInit(): void {
    this.currentEvents = this.ns.opticalShowCurrent;
    this.orderDescending = this.ns.opticalOrderDescending;
    // this.loadIfNotLoadedBefore();
    this.refresh();
  }

  private loadIfNotLoadedBefore() {
    const opticalEvents = CoreUtils.getCurrentState(
      this.store,
      OpticalEventsSelectors.selectOpticalEvents
    );
    console.log(opticalEvents);
    if (opticalEvents.length === 0) {
      this.refresh();
    }
  }

  currentEvents!: boolean;
  onCurrentEventsToggle() {
    this.currentEvents = !this.currentEvents;
    this.ns.setOne('OpticalEvent', this.currentEvents, this.orderDescending, -1);
    this.refresh();
  }

  // function used by `relative-time-refresh` button
  refreshV2() {
    this.refresh();
  }

  // onLoadMore() {
  //   this.opticalEvents$;
  // }

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
