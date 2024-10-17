import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AnyTypeEventsSelectors, AppState, DeviceSelectors, SettingsSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-start-page-sidebar',
  templateUrl: 'start-page-sidebar.component.html'
})
export class StartPageSidebarComponent {
  theme$ = this.store.select(SettingsSelectors.selectTheme);
  version$ = this.store.select(DeviceSelectors.selectApiVersion);

  hasCurrent$ = this.store.select(DeviceSelectors.selectHasCurrent);
  hasNew$ = this.store.select(AnyTypeEventsSelectors.selectHasAny);

  constructor(private store: Store<AppState>) {}
}
