import { Component, Input } from '@angular/core';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

@Component({
  selector: 'rtu-one-rtu',
  templateUrl: './one-rtu.component.html'
})
export class OneRtuComponent {
  @Input() rtu!: Rtu;
  @Input() children!: any[];

  isExpanded = false;

  flipExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
