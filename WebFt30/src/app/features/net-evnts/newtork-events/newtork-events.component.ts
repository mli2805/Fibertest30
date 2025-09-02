import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, NetworkEventsSelectors } from 'src/app/core';
import { EventTablesService } from 'src/app/core/grpc/services/event-tables.service';
import { HowShowTablesService } from 'src/app/core/services/how-show-tables.service';
import { NetworkEvent } from 'src/app/core/store/models/ft30/network-event';
import { NetworkEventsActions } from 'src/app/core/store/network-events/network-events.actions';

@Component({
    selector: 'rtu-newtork-events',
    templateUrl: './newtork-events.component.html',
    styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NewtorkEventsComponent implements OnInit {
  networkEventsActions = NetworkEventsActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(NetworkEventsSelectors.selectLoading);
  networkEvents$ = this.store.select(NetworkEventsSelectors.selectSortedNetworkEvents);
  errorMessageId$ = this.store.select(NetworkEventsSelectors.selectErrorMessageId);

  orderDescending!: boolean;
  portionSize: number;

  constructor(private ns: HowShowTablesService, private et: EventTablesService) {
    this.portionSize = et.portionSize;
  }

  ngOnInit(): void {
    this.currentEvents = this.ns.networkShowCurrent;
    this.orderDescending = this.ns.networkOrderDescending;
    this.refresh();
  }

  currentEvents!: boolean;
  onCurrentEventsToggle() {
    this.currentEvents = !this.currentEvents;
    this.ns.setOne('NetworkEvent', this.currentEvents, this.orderDescending, -1);
    this.refresh();
  }

  loadNextPage(lastLoadedEvent: NetworkEvent) {
    this.store.dispatch(
      NetworkEventsActions.loadNextNetworkEvents({
        currentEvents: this.currentEvents,
        orderDescending: this.orderDescending,
        lastLoaded: lastLoadedEvent.registeredAt,
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
      NetworkEventsActions.getNetworkEvents({
        currentEvents: this.currentEvents,
        orderDescending: this.orderDescending,
        searchWindow: null
      })
    );
  }
}
