import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, AuthSelectors, DeviceSelectors, SettingsSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-start-page-sidebar',
  templateUrl: 'start-page-sidebar.component.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartPageSidebarComponent implements OnInit, OnDestroy {
  public currentDate: any;
  private clockInterval: any;

  theme$ = this.store.select(SettingsSelectors.selectTheme);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // as we don't show seconds in current time, let's not hit too often
    this.clockInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.clockInterval);
  }
}
