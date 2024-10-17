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

  hasCurrent$ = this.store.select(DeviceSelectors.selectHasCurrent);

  constructor(private store: Store<AppState>) {}
}
