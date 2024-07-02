import { Component, Input } from '@angular/core';
import { PushNotificationSettings } from '../../../../../../../core/store/models/notification-settings';

@Component({
  selector: 'rtu-push-notification-settings',
  templateUrl: './push-notification-settings.component.html',
  styleUrls: ['./push-notification-settings.component.css']
})
export class PushNotificationSettingsComponent {
  @Input() pushSettings!: PushNotificationSettings;
  @Input() hasPermission!: boolean;
}
