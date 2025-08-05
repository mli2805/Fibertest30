import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, BopEventsActions, BopEventsSelectors } from 'src/app/core';
import { EventTablesService } from 'src/app/core/grpc/services/event-tables.service';
import { HowShowTablesService } from 'src/app/core/services/how-show-tables.service';
import { BopEvent } from 'src/app/core/store/models/ft30/bop-event';

@Component({
  selector: 'rtu-bop-network-events',
  templateUrl: './bop-network-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BopNetworkEventsComponent implements OnInit {
  bopEventsActions = BopEventsActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(BopEventsSelectors.selectLoading);
  bopEvents$ = this.store.select(BopEventsSelectors.selectSortedBopEvents);
  errorMessageId$ = this.store.select(BopEventsSelectors.selectErrorMessageId);

  orderDescending!: boolean;
  portionSize: number;

  constructor(private ns: HowShowTablesService, private et: EventTablesService) {
    this.portionSize = et.portionSize;
  }

  ngOnInit(): void {
    this.currentEvents = this.ns.bopNetworkShowCurrent;
    this.orderDescending = this.ns.bopNetworkOrderDescending;
    this.refresh();
  }

  currentEvents!: boolean;
  onCurrentEventsToggle() {
    this.currentEvents = !this.currentEvents;
    this.ns.setOne('BopNetworkEvent', this.currentEvents, this.orderDescending, -1);
    this.refresh();
  }

  loadNextPage(lastLoadedEvent: BopEvent) {
    this.store.dispatch(
      BopEventsActions.loadNextBopEvents({
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
      BopEventsActions.getBopEvents({
        currentEvents: this.currentEvents,
        orderDescending: this.orderDescending,
        searchWindow: null
      })
    );
  }
}
