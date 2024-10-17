import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnyTypeEventsActions, AnyTypeEventsSelectors, AppState } from 'src/app/core';
import { AnyTypeEvent } from 'src/app/core/store/models/ft30/any-type-event';

@Component({
  selector: 'rtu-new-events-table',
  templateUrl: './new-events-table.component.html'
})
export class NewEventsTableComponent {
  private store: Store<AppState> = inject(Store<AppState>);

  anyTypeEvents$ = this.store.select(AnyTypeEventsSelectors.selectAnyTypeEvents);

  dismissEvent(evnt: AnyTypeEvent) {
    this.store.dispatch(AnyTypeEventsActions.removeEvent({ removeEvent: evnt }));
  }
}
