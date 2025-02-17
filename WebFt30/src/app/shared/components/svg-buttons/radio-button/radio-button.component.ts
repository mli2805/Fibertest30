import { Component, Input } from '@angular/core';
import { RadioButton } from './radio-button';

@Component({
  selector: 'rtu-radio-button',
  templateUrl: './radio-button.component.html'
})
export class RadioButtonComponent {
  @Input() button!: RadioButton;
}
