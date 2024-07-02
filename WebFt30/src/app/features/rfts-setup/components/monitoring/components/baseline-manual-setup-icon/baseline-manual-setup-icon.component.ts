import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitoringBaseline, MonitoringPort } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-baseline-manual-setup-icon',
  templateUrl: 'baseline-manual-setup-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineManualSetupIconComponent {
  @Input() monitoringPort!: MonitoringPort;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  navigateToBaseline() {
    this.router.navigate(['dashboard', this.monitoringPort.id], {
      relativeTo: this.route
    });
  }
}
