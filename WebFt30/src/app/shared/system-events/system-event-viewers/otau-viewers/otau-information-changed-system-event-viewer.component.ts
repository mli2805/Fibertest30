import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import { LabelWithDiff } from 'src/app/shared/components/label-with-diff/label-with-diff.component';
import { OtauInformationChangedData } from '../../system-event-data';

//q
@Component({
  template: `<div>
    <rtu-otau-title *ngIf="data" [otauId]="data.OtauId"></rtu-otau-title>
    <span class="ml-1 lowercase">{{ 'i18n.common.changed' | translate }}</span>
    <rtu-label-with-diff [diffs]="diffs" />
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtauInformationChangedSystemEventViewerComponent {
  public data!: OtauInformationChangedData;
  public diffs: LabelWithDiff[] = [];

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <OtauInformationChangedData>JSON.parse(value.jsonData);

    for (const cp of this.data.ChangedProperties) {
      this.diffs.push({
        labelId: this.getStringId(cp.PropertyName),
        oldValue: cp.OldValue,
        newValue: cp.NewValue
      });
    }
  }

  getStringId(prop: string) {
    // corresponding type is OtauPatch
    switch (prop) {
      case 'Name':
        return 'i18n.common.name';
      case 'Location':
        return 'i18n.otau.location';
      case 'Rack':
        return 'i18n.otau.rack';
      case 'Shelf':
        return 'i18n.otau.shelf';
      case 'Note':
        return 'i18n.otau.note';

      default:
        return 'i18n.common.uknwown';
    }
  }
}
