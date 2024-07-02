import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import { OtauConnectionStatusChangedData } from '../../system-event-data';

@Component({
  template: `<div>
    <rtu-otau-title *ngIf="data" [otauId]="data.OtauId"></rtu-otau-title>
    <span class="text-green-500" *ngIf="data.IsConnected">
      {{ 'i18n.common.online' | translate }}
    </span>
    <span class="text-red-500" *ngIf="!data.IsConnected">
      {{ 'i18n.common.offline' | translate }}
    </span>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauConnectionStatusChangedSystemEventViewerComponent {
  public data!: OtauConnectionStatusChangedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <OtauConnectionStatusChangedData>JSON.parse(value.jsonData);
  }
}
