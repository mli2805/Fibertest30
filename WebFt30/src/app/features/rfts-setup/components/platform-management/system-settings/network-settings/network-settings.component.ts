import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { NetworkSettingsActions } from 'src/app/core/store/network-settings/network-settings.action';
import { NetworkSettingsSelectors } from 'src/app/core/store/network-settings/network-settings.selectors';
import { Ipv4SettingsComponent } from './ipv4-settings/ipv4-settings.component';

@Component({
  selector: 'rtu-network-settings',
  templateUrl: './network-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkSettingsComponent {
  @ViewChild(Ipv4SettingsComponent) ipv4SettingsComponent!: Ipv4SettingsComponent;

  store: Store<AppState> = inject(Store<AppState>);

  networkSettings$ = this.store.select(NetworkSettingsSelectors.selectNetworkSettings);

  constructor(private router: Router) {}

  isApplyDisabled() {
    if (!this.ipv4SettingsComponent) return true;
    return !this.ipv4SettingsComponent.isChangedAndValid();
  }

  onApplyClicked() {
    const settings = this.ipv4SettingsComponent.buildSettings();
    this.store.dispatch(NetworkSettingsActions.updateNetworkSettings({ settings }));
    this.ipv4SettingsComponent.form.markAsPristine();
  }

  isDiscardDisabled() {
    if (!this.ipv4SettingsComponent) return true;
    return !this.ipv4SettingsComponent.isSomethingChanged();
  }

  // discard changes by routing to this page again
  onDiscardClicked() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/rfts-setup/platform-management/network']);
    });
  }
}
