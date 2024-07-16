import { Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-free-port',
  templateUrl: './free-port.component.html'
})
export class FreePortComponent {
  @Input() port!: number;
  @Input() i!: number;
}
