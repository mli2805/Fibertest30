import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { MonitoringPortStatus } from 'src/grpc-generated';

@Component({
  selector: 'rtu-monitoring-port-status',
  templateUrl: 'monitoring-port-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringPortStatusComponent {
  convertUtils = ConvertUtils;
  monitoringPortStatus = MonitoringPortStatus;

  @Input() status!: MonitoringPortStatus;
}
