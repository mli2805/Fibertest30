import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AlarmProfileDeletedData } from '../../system-event-data';
import { SystemEvent } from 'src/app/core/store/models';

@Component({
  template: `
    <div>
      <span>
        {{ 'i18n.alarm-profiles.alarm-profile' | translate }}
      </span>
      <span class="text-data-highlight mx-2">ID = {{ data.AlarmProfileId }}</span>
      <span>{{ 'i18n.common.deleted' | translate | lowercase }} </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmProfileDeletedEventViewerComponent {
  public data!: AlarmProfileDeletedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <AlarmProfileDeletedData>JSON.parse(value.jsonData);
  }
}
