import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, DeviceSelectors } from 'src/app/core';
import { NetworkSettingsSelectors } from 'src/app/core/store/network-settings/network-settings.selectors';
import { TimeSettingsSelectors } from 'src/app/core/store/time-settings/time-settings.selectors';

@Component({
  selector: 'rtu-system-settings',
  templateUrl: './system-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemSettingsComponent {
  store: Store<AppState> = inject(Store<AppState>);
  deviceInfo$ = this.store.select(DeviceSelectors.selectInfo);
  loading$ = this.store.select(DeviceSelectors.selectLoading);
  timeSettingsLoading$ = this.store.select(TimeSettingsSelectors.selectLoading);
  networkSettingsLoading$ = this.store.select(NetworkSettingsSelectors.selectLoading);

  hasChangeNetworkSettingsPermission$ = this.store.select(
    AuthSelectors.selectHasChangeNetworkSettingsPermission
  );

  hasChangeTimeSettingsPermission$ = this.store.select(
    AuthSelectors.selectHasChangeTimeSettingsPermission
  );
}
