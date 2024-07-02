import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SystemEvent } from 'src/app/core/store/models';
import { BaselineFailedData } from '../../system-event-data';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';

@Component({
  template: `
    <div class="text-red-500 dark:text-red-400">
      {{ 'i18n.system-events-viewer.baseline-failed' | translate }}
    </div>
    <div *ngIf="getOtauPortPathByMonitoringPortId(data.MonitoringPortId) as otauPortPath">
      {{ 'i18n.common.port' | translate }}:
      <rtu-otau-port-path-title [otauPortPath]="otauPortPath"></rtu-otau-port-path-title>
    </div>
    <div *ngIf="failReason !== null" class="text-red-500 dark:text-red-400">
      {{ failReason | translate }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineFailedSystemEventViewerComponent {
  data!: BaselineFailedData;
  failReason!: string | null;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <BaselineFailedData>JSON.parse(value.jsonData);
    this.failReason = CoreUtils.otauFailReasonToMessageId(this.data.FailReason);
  }

  constructor(private store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }
}
