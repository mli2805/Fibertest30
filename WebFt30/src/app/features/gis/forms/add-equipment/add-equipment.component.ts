import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GraphService } from 'src/app/core/grpc';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapService } from '../../gis-map.service';
import { GeoEquipment } from 'src/app/core/store/models/ft30/geo-data';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { MapLayersActions } from '../../components/gis-editor-map/map-layers-actions';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { ValidationUtils } from 'src/app/shared/utils/validation-utils';

@Component({
  selector: 'rtu-add-equipment',
  templateUrl: './add-equipment.component.html'
})
export class AddEquipmentComponent {
  form!: FormGroup;
  nodeId!: string;
  addMode = true;
  equipmentInWork!: GeoEquipment;

  buttons = [
    { id: 0, isSelected: true, title: this.ts.instant('i18n.ft.closure') },
    { id: 1, isSelected: false, title: this.ts.instant('i18n.ft.terminal') },
    { id: 2, isSelected: false, title: this.ts.instant('i18n.ft.cross') },
    { id: 3, isSelected: false, title: this.ts.instant('i18n.ft.cable-reserve') },
    { id: 4, isSelected: false, title: this.ts.instant('i18n.ft.other') }
  ];

  constructor(
    public gisMapService: GisMapService,
    private graphService: GraphService,
    private ts: TranslateService
  ) {
    // this.nodeId = gisMapService.showAddEquipment.value!;
    // this.addMode = gisMapService.updateEquipment === null;
    // this.equipmentInWork = this.addMode
    //   ? new GeoEquipment(crypto.randomUUID(), '', this.nodeId, EquipmentType.Closure, 0, 0, '')
    //   : gisMapService.updateEquipment!;

    this.form = new FormGroup({
      title: new FormControl(this.equipmentInWork.title),
      leftReserve: new FormControl(this.equipmentInWork.cableReserveLeft, [
        Validators.required,
        Validators.pattern(ValidationUtils.NonNegativeInteger),
        Validators.min(0),
        Validators.max(200)
      ]),
      rightReserve: new FormControl(this.equipmentInWork.cableReserveRight, [
        Validators.required,
        Validators.pattern(ValidationUtils.NonNegativeInteger),
        Validators.min(0),
        Validators.max(200)
      ]),
      comment: new FormControl(this.equipmentInWork.comment)
    });
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });

    console.log(this.buttons);
  }

  isleftReserveInvalid(): boolean {
    const control = this.form.controls['leftReserve'];
    return control.invalid && (control.dirty || control.touched);
  }

  isRightReserveInvalid(): boolean {
    const control = this.form.controls['rightReserve'];
    const selectedType = this.getSelectedEquipmentType();
    if (
      +control.value !== 0 &&
      (selectedType === EquipmentType.Terminal || selectedType === EquipmentType.CableReserve)
    )
      return true;
    return control.invalid && (control.dirty || control.touched);
  }

  isApplyDisabled(): boolean {
    if (this.form.pristine) return true;
    if (!this.form.valid || this.isRightReserveInvalid()) return true;

    return false;
  }

  async onApplyClicked() {
    const command = {
      EquipmentId: crypto.randomUUID(),
      NodeId: this.nodeId,
      Title: this.form.controls['title'].value,
      Type: this.getSelectedEquipmentType(),
      CableReserveLeft: +this.form.controls['leftReserve'].value,
      CableReserveRight: +this.form.controls['rightReserve'].value,
      Comment: this.form.controls['comment'].value
    };
    const cmd = JSON.stringify(command);
    const response = await firstValueFrom(
      this.graphService.sendCommand(cmd, 'AddEquipmentIntoNode')
    );
    if (response.success) {
      const node = this.gisMapService.getNode(this.nodeId);

      const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(layerType)!;
      const marker = group.getLayers().find((m) => (<any>m).id === this.nodeId);
      group.removeLayer(marker!);

      const equipment = new GeoEquipment(
        command.EquipmentId,
        command.Title,
        command.NodeId,
        command.Type,
        command.CableReserveLeft,
        command.CableReserveRight,
        command.Comment
      );
      this.gisMapService.getGeoData().equipments.push(equipment);

      node.equipmentType = command.Type;
      MapLayersActions.addNodeToLayer(node);
    }
    // this.gisMapService.showAddEquipment.next(null);
    // this.gisMapService.updateEquipment = null;
  }

  onDiscardClicked() {
    // this.gisMapService.showAddEquipment.next(null);
    // this.gisMapService.updateEquipment = null;
  }

  getSelectedEquipmentType() {
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
}
