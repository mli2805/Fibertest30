import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { EquipmentType } from 'src/grpc-generated';

@Component({
  selector: 'rtu-next-step-selector',
  templateUrl: './next-step-selector.component.html'
})
export class NextStepSelectorComponent {
  buttons!: RadioButton[];

  @Input() set steps(value: RadioButton[]) {
    this.buttons = value;
  }
  @Output() changedValueEvent = new EventEmitter<EquipmentType>();

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });

    this.changedValueEvent.emit(id);
  }
}
