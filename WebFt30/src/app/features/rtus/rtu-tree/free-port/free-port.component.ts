import { Component, Input } from '@angular/core';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-free-port',
  templateUrl: './free-port.component.html'
})
export class FreePortComponent {
  @Input() portOfOtau!: PortOfOtau;
  @Input() i!: number;
  @Input() rtu!: Rtu;
  @Input() detachedTraces!: Trace[];
}
