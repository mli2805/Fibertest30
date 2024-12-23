import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, DeviceActions, DeviceSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-ft-settings',
  templateUrl: 'ft-settings.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class FtSettingsComponent {
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(DeviceSelectors.selectLoading);

  downloadLogs() {
    console.log('logs');
    this.store.dispatch(DeviceActions.getLogBundle());
  }
}
