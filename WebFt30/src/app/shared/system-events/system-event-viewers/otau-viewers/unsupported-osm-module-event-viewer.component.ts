import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import { UnsupportedOsmModuleData } from '../../system-event-data/otau/unsupported-osm-module-data';

@Component({
  template: `<div>
    <div>{{ 'i18n.otau.unsupported-osm-module' | translate }}</div>
    <div>{{ 'i18n.otau.connected-to-ocm-port' | translate : { '0': data.OcmPortIndex } }}</div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsupportedOsmModuleEventViewerComponent {
  public data!: UnsupportedOsmModuleData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <UnsupportedOsmModuleData>JSON.parse(value.jsonData);
  }
}
