import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'rtu-equipment-edit',
  templateUrl: './equipment-edit.component.html'
})
export class EquipmentEditComponent {
  @Input() form!: FormGroup;
}
