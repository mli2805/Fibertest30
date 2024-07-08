import { Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-free-port',
  templateUrl: './free-port.component.html',
  styleUrls: ['./free-port.component.scss']
})
export class FreePortComponent {
  @Input() port!: number;
}
