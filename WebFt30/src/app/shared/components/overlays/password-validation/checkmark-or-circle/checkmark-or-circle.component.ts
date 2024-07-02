import { Component, Input } from '@angular/core';

@Component({
  selector: 'rtu-checkmark-or-circle',
  templateUrl: './checkmark-or-circle.component.html'
})
export class CheckmarkOrCircleComponent {
  @Input() isCheckmark = true;
}
