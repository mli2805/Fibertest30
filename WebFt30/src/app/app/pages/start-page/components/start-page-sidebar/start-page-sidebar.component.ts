import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { AudioEventsSelectors, AppState, DeviceSelectors, SettingsSelectors } from 'src/app/core';
import { AudioService } from 'src/app/core/services/audio.service';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'rtu-start-page-sidebar',
  templateUrl: 'start-page-sidebar.component.html'
})
export class StartPageSidebarComponent {
  theme$ = this.store.select(SettingsSelectors.selectTheme);
  version$ = this.store.select(DeviceSelectors.selectApiVersion);

  hasCurrent$ = this.store.select(DeviceSelectors.selectHasCurrent);
  hasNew$ = this.store.select(AudioEventsSelectors.selectHasAny);

  rootOfActiveLink = '';

  constructor(
    private store: Store<AppState>,
    private audioService: AudioService,
    private router: Router
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.rootOfActiveLink = router.url.split('/')[1];
    });
  }

  async onRtuTreeClicked() {
    this.audioService.stopAll();
    this.router.navigate(['./rtus']);
  }

  async onNewEventsClicked() {
    await Utils.delay(100);

    this.audioService.stopAll();
    this.router.navigate(['./evnts-new']);
  }

  // перенес все клики на кнопка бокового меню в код вместо строк в html типа
  // [routerLink]="['./op-evnts']"
  // чтобы можно было задать задержку и контекстное меню на первой форме успевали закрыться
  async onOptEventsClicked(event?: Event) {
    await Utils.delay(100);

    this.audioService.stopAll();
    this.router.navigate(['./op-evnts']);
  }

  async onNetEventsClicked() {
    await Utils.delay(100);

    this.audioService.stopAll();
    this.router.navigate(['./net-evnts']);
  }

  async onBopEventsClicked() {
    await Utils.delay(100);

    this.audioService.stopAll();
    this.router.navigate(['./bop-net-evnts']);
  }

  async onRtuStatusEventsClicked() {
    await Utils.delay(100);

    this.audioService.stopAll();
    this.router.navigate(['./sts-evnts']);
  }

  async onSettinsClicked() {
    await Utils.delay(100);

    this.audioService.stopAll();
    this.router.navigate(['./ft-settings']);
  }

  async onReportsClicked() {
    await Utils.delay(100);

    this.audioService.stopAll();
    this.router.navigate(['./reports']);
  }
}
