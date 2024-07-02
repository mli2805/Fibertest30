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
import { BaselineCompletedData } from '../../system-event-data';
import { AppState, OtausSelectors } from 'src/app/core';
import { Store } from '@ngrx/store';
import { CoreUtils } from 'src/app/core/core.utils';

@Component({
  template: `
    <div class="flex items-center justify-between">
      <div>
        <span>{{ 'i18n.system-events-viewer.baseline-completed' | translate }}</span>
        <div>
          <div *ngIf="getOtauPortPathByMonitoringPortId(data.MonitoringPortId) as otauPortPath">
            {{ 'i18n.common.port' | translate }}:
            <rtu-otau-port-path-title [otauPortPath]="otauPortPath"></rtu-otau-port-path-title>
          </div>
        </div>
      </div>

      <rtu-navigate-button class="ml-1 h-6 w-6" (click)="navigatedToBaseline()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineCompletedSystemEventViewerComponent {
  public data!: BaselineCompletedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <BaselineCompletedData>JSON.parse(value.jsonData);
  }

  @Output() navigatedToEvent = new EventEmitter<any>();

  constructor(private router: Router, private store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  navigatedToBaseline() {
    // this.router.navigate(['/reporting/baseline-history', this.data.BaselineId]);
    const otauPath = CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(this.data.MonitoringPortId)
    );

    this.router.navigate([
      '/rfts-setup/monitoring/ports',
      otauPath?.ocmPort.portIndex,
      'dashboard',
      this.data.MonitoringPortId
    ]);
    this.navigatedToEvent.emit();
  }
}
