import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import { OtauRemovedData } from '../../system-event-data';

@Component({
  template: `<div>
    <span class="uppercase"> {{ data.OtauType }}</span>
    <span *ngIf="data.OcmPortIndex > 0" class="ml-1 font-bold text-blue-600 dark:text-blue-400">{{
      data.OcmPortIndex
    }}</span>
    <span class="ml-1 lowercase">{{ 'i18n.common.removed' | translate }}</span>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauRemovedEventViewerComponent {
  public data!: OtauRemovedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <OtauRemovedData>JSON.parse(value.jsonData);
  }
}
