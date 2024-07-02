import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import { OtauAddedData } from '../../system-event-data';

@Component({
  template: `<div>
    <span class="uppercase"> {{ data.OtauType }}</span>
    <span *ngIf="data.OcmPortIndex > 0" class="ml-1 font-bold text-blue-600 dark:text-blue-400">{{
      data.OcmPortIndex
    }}</span>
    <span class="ml-1 lowercase">{{ 'i18n.common.added' | translate }}</span>
    <div>
      <div>
        <span>{{ 'i18n.common.serial-number' | translate }}:</span>
        <span class="ml-1">{{ data.SerialNumber }}</span>
      </div>
      <div>
        <span>{{ 'i18n.common.port-count' | translate }}:</span>
        <span class="ml-1">{{ data.PortCount }}</span>
      </div>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauAddedEventViewerComponent {
  public data!: OtauAddedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <OtauAddedData>JSON.parse(value.jsonData);
  }
}
