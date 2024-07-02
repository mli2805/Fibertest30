import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Otau, SystemEvent } from 'src/app/core/store/models';
import { LabelWithDiff } from 'src/app/shared/components/label-with-diff/label-with-diff.component';
import { OtauChangedData } from '../../system-event-data';

@Component({
  template: `<div>
    <div>
      <rtu-otau-title *ngIf="data" [otauId]="data.OtauId"></rtu-otau-title>
      <span class="ml-1 lowercase">{{ 'i18n.common.changed' | translate }}</span>
    </div>
    <rtu-label-with-diff [diffs]="diffs" />
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauChangedSystemEventViewerComponent {
  public data!: OtauChangedData;
  public diffs: LabelWithDiff[] = [];

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <OtauChangedData>JSON.parse(value.jsonData);

    this.diffs.push({
      labelId: 'i18n.common.serial-number',
      oldValue: this.data.OldSerialNumber,
      newValue: this.data.NewSerialNumber
    });

    if (this.data.OldPortCount && this.data.NewPortCount) {
      this.diffs.push({
        labelId: 'i18n.common.port-count',
        oldValue: this.data.OldPortCount,
        newValue: this.data.NewPortCount
      });
    }
  }
}
