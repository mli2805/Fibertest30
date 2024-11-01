import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AnyTypeEventsSelectors, AppState, DeviceSelectors, SettingsSelectors } from 'src/app/core';
import { AudioService } from 'src/app/core/services/audio.service';

@Component({
  selector: 'rtu-start-page-sidebar',
  templateUrl: 'start-page-sidebar.component.html'
})
export class StartPageSidebarComponent {
  theme$ = this.store.select(SettingsSelectors.selectTheme);
  version$ = this.store.select(DeviceSelectors.selectApiVersion);

  hasCurrent$ = this.store.select(DeviceSelectors.selectHasCurrent);
  hasNew$ = this.store.select(AnyTypeEventsSelectors.selectHasAny);

  private router: Router = inject(Router);
  constructor(private store: Store<AppState>, private audioService: AudioService) {}

  onNewEventsClicked() {
    this.audioService.stopAll();
  }
}
