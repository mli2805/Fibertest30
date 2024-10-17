import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState, DeviceSelectors, SettingsSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-start-page-sidebar',
  templateUrl: 'start-page-sidebar.component.html'
})
export class StartPageSidebarComponent {
  theme$ = this.store.select(SettingsSelectors.selectTheme);
  version$ = this.store.select(DeviceSelectors.selectApiVersion);

  hasCurrentOpticalEvents$ = this.store.select(DeviceSelectors.selectHasCurrentOpticalEvents);
  hasCurrentNetworkEvents$ = this.store.select(DeviceSelectors.selectHasCurrentNetworkEvents);
  hasCurrentBopNetworkEvents$ = this.store.select(DeviceSelectors.selectHasCurrentBopNetworkEvents);
  hasCurrentRtuAccidents$ = this.store.select(DeviceSelectors.selectHasCurrentRtuAccidents);

  constructor(private store: Store<AppState>) {}
}
