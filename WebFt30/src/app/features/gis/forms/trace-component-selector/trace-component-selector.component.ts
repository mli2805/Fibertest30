import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { GisMapService } from '../../gis-map.service';
import { MapLayersActions } from '../../components/gis-editor-map/map-layers-actions';

@Component({
  selector: 'rtu-trace-component-selector',
  templateUrl: './trace-component-selector.component.html'
})
export class TraceComponentSelectorComponent {
  public dialogRef: DialogRef<number | null> = inject(DialogRef<number | null>);
  form!: FormGroup;
  buttons!: any[]; // не просто RadioButton, там добавлено поле equipment
  childForms: FormGroup[] = [];
  node!: TraceNode;
  gisMapService!: GisMapService;

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    private ts: TranslateService,
    private graphService: GraphService
  ) {
    this.gisMapService = data.gisMapService;
    this.buttons = data.buttons;

    for (let i = 0; i < data.buttons.length; i++) {
      this.childForms.push(this.createChildForm(data.buttons[i]));
    }

    // const index = this.buttons.length;
    this.buttons.push({
      id: -1,
      title: this.ts.instant('i18n.ft.do-not-use-equipment'),
      isSelected: data.buttons.length === 0
    });
    this.node = data.node;

    this.form = new FormGroup({
      title: new FormControl(this.node.title)
    });
  }

  createChildForm(button: any): FormGroup {
    const childFormGroup = new FormGroup({
      title: new FormControl(button.equipment.title),
      leftReserve: new FormControl(button.equipment.cableReserveLeft),
      rightReserve: new FormControl(button.equipment.cableReserveRight)
    });

    return childFormGroup;
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });
  }

  async onNext() {
    await this.saveNodeTitleChanges();
    await this.saveEquipmentChanges();

    const result = this.buttons.find((b) => b.isSelected)!.id;
    this.dialogRef.close(result);
  }

  onExit() {
    this.dialogRef.close(null);
  }

  async saveNodeTitleChanges() {
    if (this.node.title === this.form.controls['title'].value) return;
    const command = {
      NodeId: this.node.id,
      Title: this.form.controls['title'].value,
      Comment: this.node.comment
    };
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'UpdateNode'));
    if (response.success) {
      this.node.title = this.form.controls['title'].value;
      const layerType = GisMapUtils.equipmentTypeToGisMapLayer(this.node.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(layerType)!;
      const marker = group.getLayers().find((m) => (<any>m).id === this.node.id);
      group.removeLayer(marker!);
      MapLayersActions.addNodeToLayer(this.node);
    }
  }

  async saveEquipmentChanges() {
    for (let i = 0; i < this.buttons.length - 1; i++) {
      const button = <any>this.buttons[i];
      const childForm = this.childForms[i];
      if (
        button.eqTitle !== childForm.controls['title'].value ||
        button.left !== childForm.controls['leftReserve'].value ||
        button.right !== childForm.controls['rightReserve'].value
      ) {
        const command = {
          EquipmentId: button.equipment.id,
          Title: childForm.controls['title'].value,
          Type: button.equipment.type,
          CableReserveLeft: +childForm.controls['leftReserve'].value,
          CableReserveRight: +childForm.controls['rightReserve'].value,
          Comment: button.equipment.comment
        };
        const json = JSON.stringify(command);
        const response = await firstValueFrom(
          this.graphService.sendCommand(json, 'UpdateEquipment')
        );
        if (response.success) {
          button.equipment.title = childForm.controls['title'].value;
          button.equipment.cableReserveLeft = +childForm.controls['leftReserve'].value;
          button.equipment.cableReserveRight = +childForm.controls['rightReserve'].value;
        }
      }
    }
  }
}
