import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GeoEquipment } from 'src/app/core/store/models/ft30/geo-data';
import { ValidationUtils } from 'src/app/shared/utils/validation-utils';
import { EquipmentType } from 'src/grpc-generated';

@Component({
  selector: 'rtu-edit-equipment-dialog',
  templateUrl: './edit-equipment-dialog.component.html'
})
export class EditEquipmentDialogComponent {
  equipmentType = EquipmentType;
  public dialogRef: DialogRef<string | null> = inject(DialogRef<string | null>);
  form!: FormGroup;
  nodeId!: string;
  addMode = true;
  equipmentInWork!: GeoEquipment;
  selectedType!: EquipmentType;
  tracesForInsertion!: string[];

  constructor(@Inject(DIALOG_DATA) private data: any) {
    this.nodeId = data.nodeId;
    this.addMode = data.addMode;
    this.equipmentInWork = this.addMode
      ? new GeoEquipment(crypto.randomUUID(), '', this.nodeId, EquipmentType.Closure, 0, 0, '')
      : data.equipment;
    this.selectedType = this.addMode ? EquipmentType.Closure : data.equipment.type;
    this.tracesForInsertion = data.traceForInsertion;

    this.form = new FormGroup({
      title: new FormControl(this.equipmentInWork.title),
      leftReserve: new FormControl(this.equipmentInWork.cableReserveLeft, [
        Validators.pattern(ValidationUtils.NonNegativeInteger),
        Validators.min(0),
        Validators.max(200)
      ]),
      rightReserve: new FormControl(this.equipmentInWork.cableReserveRight, [
        Validators.pattern(ValidationUtils.NonNegativeInteger),
        Validators.min(0),
        Validators.max(200)
      ]),
      comment: new FormControl(this.equipmentInWork.comment)
    });

    if (this.addMode) {
      this.form.markAsDirty();
    }
  }

  isleftReserveInvalid(): boolean {
    const control = this.form.controls['leftReserve'];
    if (
      this.selectedType === EquipmentType.CableReserve &&
      (control.value === '' || +control.value === 0)
    )
      return true;
    return control.invalid && (control.dirty || control.touched);
  }

  isRightReserveInvalid(): boolean {
    const control = this.form.controls['rightReserve'];
    return control.invalid && (control.dirty || control.touched);
  }

  isApplyDisabled(): boolean {
    if (this.form.pristine) return true;
    if (!this.form.valid || this.isleftReserveInvalid() || this.isRightReserveInvalid())
      return true;

    return false;
  }

  async onApplyClicked() {
    const command = {
      EquipmentId: this.addMode ? crypto.randomUUID() : this.equipmentInWork.id,
      NodeId: this.nodeId,
      Title: this.form.controls['title'].value,
      Type: this.selectedType,
      CableReserveLeft: +this.form.controls['leftReserve'].value,
      // контрол м.б. спрятан и тогда не надо брать его значение
      CableReserveRight:
        this.selectedType === EquipmentType.Terminal ||
        this.selectedType === EquipmentType.CableReserve
          ? 0
          : +this.form.controls['rightReserve'].value,
      Comment: this.form.controls['comment'].value
    };

    if (this.addMode) {
      // это свойство есть только в команде Добавить
      (<any>command).TracesForInsertion = this.tracesForInsertion;
    }

    const json = JSON.stringify(command);

    this.dialogRef.close(json);
  }

  close() {
    this.dialogRef.close(null);
  }

  isDiscardDisabled() {
    return this.form.pristine;
  }

  onDiscardClicked() {
    this.dialogRef.close(null);
  }

  onEquipmentTypeChanged($event: any) {
    this.selectedType = $event;
    this.form.markAsDirty();
  }
}
