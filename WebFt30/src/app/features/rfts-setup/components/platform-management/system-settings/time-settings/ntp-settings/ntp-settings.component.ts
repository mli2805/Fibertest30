import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { NtpSettings } from 'src/app/core/store/models/ntp-settings';
import { TimeSettingsSelectors } from 'src/app/core/store/time-settings/time-settings.selectors';

@Component({
  selector: 'rtu-ntp-settings',
  templateUrl: './ntp-settings.component.html',
  styleUrls: ['./ntp-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NtpSettingsComponent implements OnInit {
  ntpSettings!: NtpSettings | null;

  form!: FormGroup;
  public store: Store<AppState> = inject(Store);

  ngOnInit(): void {
    const timeSettings = CoreUtils.getCurrentState(
      this.store,
      TimeSettingsSelectors.selectTimeSettings
    );
    this.ntpSettings = timeSettings!.ntpSettings;

    this.form = new FormGroup({
      primaryNtpServer: new FormControl(this.ntpSettings!.primaryNtpServer),
      secondaryNtpServer: new FormControl(this.ntpSettings!.secondaryNtpServer)
    });
  }
}
