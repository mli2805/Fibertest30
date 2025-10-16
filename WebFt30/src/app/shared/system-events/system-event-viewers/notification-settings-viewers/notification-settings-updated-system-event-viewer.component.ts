import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import { NotificationSettingsUpdatedData } from '../../system-event-data/notification-settings/notification-settings-updated-data';

@Component({
  template: `
    <div>
      <span> {{ 'i18n.ft.notification-settings' | translate }}: </span>
      <span class="text-data-highlight mx-2">{{ data.Part }}</span>
      <span>{{ 'i18n.common.changed' | translate | lowercase }} </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NotificationSettingsUpdatedSystemEventViewerComponent {
  public data!: NotificationSettingsUpdatedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <NotificationSettingsUpdatedData>JSON.parse(value.jsonData);
  }
}
