import { Component, Input, OnInit } from '@angular/core';
import { MonitoringPort } from 'src/app/core/store/models';
import { MonitoringPortStatus } from 'src/grpc-generated';

@Component({
  selector: 'rtu-port-dashboard-info',
  templateUrl: 'port-dashboard-info.component.html'
})
export class PortDashboardInfoComponent {
  statuses = MonitoringPortStatus;

  @Input() monitoringPort!: MonitoringPort;
  @Input() lastMonitoringCompletedAt!: Date | null;
}
