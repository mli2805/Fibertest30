import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, DeviceActions } from 'src/app/core';

@Component({
  selector: 'rtu-ft-settings',
  templateUrl: 'ft-settings.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class FtSettingsComponent {
  constructor(private store: Store<AppState>) {}
  downloadLogs() {
    console.log('logs');
    this.store.dispatch(DeviceActions.getLogBundle());
  }
}
