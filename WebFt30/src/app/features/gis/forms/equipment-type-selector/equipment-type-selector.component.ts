import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EquipmentType } from 'src/grpc-generated';

@Component({
  selector: 'rtu-equipment-type-selector',
  templateUrl: './equipment-type-selector.component.html'
})
export class EquipmentTypeSelectorComponent {
  buttons = [
    { id: 0, isSelected: false, title: this.ts.instant('i18n.ft.closure') },
    { id: 1, isSelected: false, title: this.ts.instant('i18n.ft.terminal') },
    { id: 2, isSelected: false, title: this.ts.instant('i18n.ft.cross') },
    { id: 3, isSelected: false, title: this.ts.instant('i18n.ft.cable-reserve') },
    { id: 4, isSelected: false, title: this.ts.instant('i18n.ft.other') }
  ];

  @Input() set startValue(value: EquipmentType) {
    this.setSelectedEquipmentType(value);
  }
  @Output() changedValueEvent = new EventEmitter<EquipmentType>();

  constructor(private ts: TranslateService) {}

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });

    const newType = this.getSelectedEquipmentType();
    this.changedValueEvent.emit(newType);
  }

  getSelectedEquipmentType(): EquipmentType {
    const id = this.buttons.findIndex((b) => b.isSelected);

    switch (id) {
      case 0:
        return EquipmentType.Closure;
      case 1:
        return EquipmentType.Terminal;
      case 2:
        return EquipmentType.Cross;
      case 3:
        return EquipmentType.CableReserve;
      case 4:
      default:
        return EquipmentType.Other;
    }
  }

  setSelectedEquipmentType(value: EquipmentType) {
    switch (value) {
      case EquipmentType.Closure:
        this.buttons[0].isSelected = true;
        break;
      case EquipmentType.Terminal:
        this.buttons[1].isSelected = true;
        break;
      case EquipmentType.Cross:
        this.buttons[2].isSelected = true;
        break;
      case EquipmentType.CableReserve:
        this.buttons[3].isSelected = true;
        break;
      case EquipmentType.Other:
        this.buttons[4].isSelected = true;
        break;
    }
  }
}
