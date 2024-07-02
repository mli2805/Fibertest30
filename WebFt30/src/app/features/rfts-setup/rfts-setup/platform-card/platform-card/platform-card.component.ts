import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, DeviceSelectors, SettingsSelectors } from 'src/app/core';
import { TimeSettingsSelectors } from 'src/app/core/store/time-settings/time-settings.selectors';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

@Component({
  selector: 'rtu-platform-card',
  templateUrl: './platform-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformCardComponent extends OnDestroyBase {
  serialNumber$ = this.store.select(DeviceSelectors.selectSerialNumber);
  ipV4Address$ = this.store.select(DeviceSelectors.selectIpV4Address);
  apiVersion$ = this.store.select(DeviceSelectors.selectApiVersion);
  timeSettings$ = this.store.select(TimeSettingsSelectors.selectTimeSettings);

  constructor(private store: Store<AppState>) {
    super();
  }
}
