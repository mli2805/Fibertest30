import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rtu-bop-network-events',
  templateUrl: './bop-network-events.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BopNetworkEventsComponent {}
