import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rtu-alarms-group-toggle',
  templateUrl: './alarms-group-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmsGroupToggleComponent {
  @Output() toggle = new EventEmitter<void>();

  @Input() checked!: boolean;

  onToggle() {
    this.toggle.next();
  }
}
