import { Component, Input } from '@angular/core';
import { MultiSelectionButton } from './multi-selection-button';

@Component({
  selector: 'rtu-multi-selection-button',
  templateUrl: './multi-selection-button.component.html'
})
export class MultiSelectionButtonComponent {
  @Input() button!: MultiSelectionButton;
}
