import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { TimeZone } from 'src/app/core/store/models/time-zone';
import { TimeZoneList } from './time-zone-list';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeSettingsSelectors } from 'src/app/core/store/time-settings/time-settings.selectors';

@Component({
  selector: 'rtu-time-zone',
  templateUrl: './time-zone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeZoneComponent implements OnInit {
  timeZones!: TimeZone[];
  selectedTimeZone!: TimeZone;
  public store: Store<AppState> = inject(Store);

  form!: FormGroup;

  constructor() {
    this.timeZones = new TimeZoneList().timeZones;
  }

  ngOnInit(): void {
    const appTimeZone = CoreUtils.getCurrentState(this.store, TimeSettingsSelectors.selectTimeZone);
    this.selectedTimeZone =
      this.timeZones.find((x) => x.ianaId === appTimeZone?.ianaId) ?? this.timeZones[11];

    this.form = new FormGroup({
      timeZone: new FormControl(this.selectedTimeZone)
    });
  }
}
