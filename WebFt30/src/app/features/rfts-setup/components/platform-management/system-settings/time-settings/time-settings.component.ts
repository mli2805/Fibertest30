import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { NtpSettingsComponent } from './ntp-settings/ntp-settings.component';
import { TimeZoneComponent } from './time-zone/time-zone.component';
import { NtpSettings } from 'src/app/core/store/models/ntp-settings';
import { TimeSettings } from 'src/app/core/store/models/time-settings';
import { TimeSettingsSelectors, TimeSettingsActions } from 'src/app/core';

@Component({
  selector: 'rtu-time-settings',
  templateUrl: './time-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSettingsComponent {
  @ViewChild('timeZone') timeZoneComponent!: TimeZoneComponent;
  @ViewChild('ntpSettings') ntpSettingsComponent!: NtpSettingsComponent;

  store: Store<AppState> = inject(Store<AppState>);
  ntpSettings$ = this.store.select(TimeSettingsSelectors.selectTimeSettings);

  isNotChangedYet() {
    if (this.ntpSettingsComponent === undefined) return true;
    return this.ntpSettingsComponent.form.pristine && this.timeZoneComponent.form.pristine;
  }

  isApplyDisabled() {
    return this.isNotChangedYet();
  }

  onApplyClicked() {
    const ntpSettings = new NtpSettings();
    ntpSettings.primaryNtpServer =
      this.ntpSettingsComponent.form.controls['primaryNtpServer'].value;
    ntpSettings.secondaryNtpServer =
      this.ntpSettingsComponent.form.controls['secondaryNtpServer'].value;

    const timeSettings = new TimeSettings();
    timeSettings.timeZone = this.timeZoneComponent.form.controls['timeZone'].value;
    timeSettings.ntpSettings = ntpSettings;

    this.store.dispatch(TimeSettingsActions.updateTimeSettings({ settings: timeSettings }));

    this.ntpSettingsComponent.form.markAsPristine();
    this.timeZoneComponent.form.markAsPristine();
  }
}
