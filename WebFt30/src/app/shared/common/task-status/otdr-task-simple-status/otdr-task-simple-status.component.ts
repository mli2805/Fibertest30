import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-otdr-task-simple-status',
  templateUrl: 'otdr-task-simple-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtdrTaskStatusComponent {
  @Input() status!: 'pending' | 'cancelled' | 'running' | 'completed' | 'failed';
}
