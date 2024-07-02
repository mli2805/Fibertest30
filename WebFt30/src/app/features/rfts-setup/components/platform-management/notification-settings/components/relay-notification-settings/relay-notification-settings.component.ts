import { Component, Input, OnInit } from '@angular/core';
import { RelayNotificationSettings } from '../../../../../../../core/store/models/notification-settings';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'rtu-relay-notification-settings',
  templateUrl: './relay-notification-settings.component.html',
  styleUrls: ['./relay-notification-settings.component.css']
})
export class RelayNotificationSettingsComponent implements OnInit {
  @Input() relaySettings!: RelayNotificationSettings;
  @Input() hasPermission!: boolean;

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      enabled: new FormControl(this.relaySettings.enabled),
      relay1: new FormControl(this.relaySettings.relay1Enabled),
      relay2: new FormControl(this.relaySettings.relay2Enabled)
    });
  }

  isSettingOff() {
    return !this.form.controls['enabled'].value;
  }

  isSlidersDisabled() {
    return this.isSettingOff() || !this.hasPermission;
  }
}
