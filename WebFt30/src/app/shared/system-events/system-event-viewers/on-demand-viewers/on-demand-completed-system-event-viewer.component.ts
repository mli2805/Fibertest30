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
import { OnDemandCompletedData } from '../../system-event-data';
import { AppState, OtausSelectors } from 'src/app/core';
import { Store } from '@ngrx/store';
import { CoreUtils } from 'src/app/core/core.utils';

@Component({
  template: `
    <div class="flex items-center justify-between">
      <div>
        <span>{{ 'i18n.system-events-viewer.on-demand-completed' | translate }}</span>
        <div *ngIf="getOtauPortPathByMonitoringPortId(data.MonitoringPortId) as otauPortPath">
          {{ 'i18n.common.port' | translate }}:
          <rtu-otau-port-path-title [otauPortPath]="otauPortPath"></rtu-otau-port-path-title>
        </div>
      </div>
      <rtu-navigate-button class="ml-1 h-6 w-6" (click)="navigatedToOnDemand()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnDemandCompletedSystemEventViewerComponent {
  public data!: OnDemandCompletedData;

  @Input() set systemEvent(value: SystemEvent) {
    this.data = <OnDemandCompletedData>JSON.parse(value.jsonData);
  }

  @Output() navigatedToEvent = new EventEmitter<any>();

  constructor(private router: Router, private store: Store<AppState>) {}

  getOtauPortPathByMonitoringPortId(monitoringPortId: number) {
    return CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );
  }

  navigatedToOnDemand() {
    this.router.navigate(['/reporting/on-demand-history', this.data.OnDemandId]);
    this.navigatedToEvent.emit();
  }
}
