import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AlarmProfileChangedData } from '../../system-event-data';
import { SystemEvent } from 'src/app/core/store/models';

@Component({
  template: `
    <div>
      <span>
        {{ 'i18n.alarm-profiles.alarm-profile' | translate }}
      </span>
      <span class="text-data-highlight mx-2">{{ data.Name }}</span>
      <span>{{ 'i18n.common.changed' | translate | lowercase }} </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmProfileChangedEventViewerComponent {
  public data!: AlarmProfileChangedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <AlarmProfileChangedData>JSON.parse(value.jsonData);
  }
}
