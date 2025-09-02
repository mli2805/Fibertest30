import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidationUtils } from 'src/app/shared/utils/validation-utils';
import { EquipmentType } from 'src/grpc-generated';

export class WithNodesResult {
  constructor(public type: EquipmentType, public quantity: number) {}
}

@Component({
    selector: 'rtu-section-with-nodes',
    templateUrl: './section-with-nodes.component.html',
    standalone: false
})
export class SectionWithNodesComponent {
  public dialogRef: DialogRef<WithNodesResult | null> = inject(DialogRef<WithNodesResult | null>);
  form!: FormGroup;
  quantity!: number;
  quantityLimit = 60;

  buttons = [
    { id: 0, isSelected: false, title: this.ts.instant('i18n.ft.adjustment-point') },
    { id: 1, isSelected: false, title: this.ts.instant('i18n.ft.node-without-equipment') },
    { id: 2, isSelected: true, title: this.ts.instant('i18n.ft.closure') },
    { id: 3, isSelected: false, title: this.ts.instant('i18n.ft.terminal') },
    { id: 4, isSelected: false, title: this.ts.instant('i18n.ft.cross') },
    { id: 5, isSelected: false, title: this.ts.instant('i18n.ft.cable-reserve') },
    { id: 6, isSelected: false, title: this.ts.instant('i18n.ft.other') }
  ];

  constructor(private ts: TranslateService) {
    this.form = new FormGroup({
      quantity: new FormControl(this.quantity, [
        Validators.required,
        Validators.pattern(ValidationUtils.NonNegativeInteger),
        Validators.min(0),
        Validators.max(this.quantityLimit)
      ])
    });
  }

  isQuantityValid() {
    return this.form.controls['quantity'].valid;
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });
  }

  getSelectedEquipmentType(): EquipmentType {
    const id = this.buttons.findIndex((b) => b.isSelected);

    switch (id) {
      case 0:
        return EquipmentType.AdjustmentPoint;
      case 1:
        return EquipmentType.EmptyNode;
      case 2:
        return EquipmentType.Closure;
      case 3:
        return EquipmentType.Terminal;
      case 4:
        return EquipmentType.Cross;
      case 5:
        return EquipmentType.CableReserve;
      case 6:
      default:
        return EquipmentType.Other;
    }
  }

  isAddDisabled() {
    return !this.isQuantityValid();
  }

  onAddClicked() {
    this.dialogRef.close(
      new WithNodesResult(this.getSelectedEquipmentType(), +this.form.controls['quantity'].value)
    );
  }

  onDiscardClicked() {
    this.dialogRef.close(null);
  }
}
