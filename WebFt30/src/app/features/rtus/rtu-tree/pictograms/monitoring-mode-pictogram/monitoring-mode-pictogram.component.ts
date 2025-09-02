import { Component, Input } from '@angular/core';
import { MonitoringState } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
    selector: 'rtu-monitoring-mode-pictogram',
    templateUrl: './monitoring-mode-pictogram.component.html',
    standalone: false
})
export class MonitoringModePictogramComponent {
  monitoringState = MonitoringState;

  @Input() mode!: MonitoringState;
}
