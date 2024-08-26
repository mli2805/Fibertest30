import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rtu-rtu-status-events',
  templateUrl: './rtu-status-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RtuStatusEventsComponent {}
