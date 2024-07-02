import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { SystemEvent } from 'src/app/core/store/models';
import { MonitoringPortStatusChangedData } from '../../system-event-data';
import { AppState, OtausSelectors } from 'src/app/core';
import { Store } from '@ngrx/store';
import { CoreUtils } from 'src/app/core/core.utils';

@Component({
  template: `
    <div class="flex items-center">
      {{ 'i18n.common.port' | translate }}
      <rtu-otau-port-path-title
        *ngIf="
          getOtauPortPathByMonitoringPortId(data.MonitoringPortId) as otauPortPath;
          else noOtauPortPath
        "
        class="ml-1"
        [otauPortPath]="otauPortPath"
      ></rtu-otau-port-path-title>
      <ng-template #noOtauPortPath>
        <span class="text-data-highlight ml-1 lowercase">
          -{{ 'i18n.common.deleted' | translate }}-
        </span>
      </ng-template>
      <rtu-monitoring-port-status class="ml-4" [status]="data.Status"></rtu-monitoring-port-status>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringPortStatusChangedSystemEventViewerComponent {
  public data!: MonitoringPortStatusChangedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <MonitoringPortStatusChangedData>JSON.parse(value.jsonData);
  }

  @Output() navigatedToEvent = new EventEmitter<any>();

  constructor(private store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }
}
