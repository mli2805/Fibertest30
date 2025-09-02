import { AfterViewInit, Component, HostListener, Inject, inject, ViewChild } from '@angular/core';
import { GraphService } from 'src/app/core/grpc';
import { GisMapService } from '../../gis-map.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MapLayersActions } from '../../components/gis-actions/map-layers-actions';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { GeoEquipment, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType } from 'src/grpc-generated';
import { DragWatcher } from 'src/app/shared/utils/drag-watcher';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
    selector: 'rtu-trace-equipment-selector',
    templateUrl: './trace-equipment-selector.component.html',
    standalone: false
})
export class TraceEquipmentSelectorComponent implements AfterViewInit {
  public dialogRef: DialogRef<number | null> = inject(DialogRef<number | null>);

  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  form!: FormGroup;
  buttons!: any[]; // не просто RadioButton, там добавлено поле equipment
  fromLandmarks!: boolean;
  childForms: FormGroup[] = [];
  node!: TraceNode;

  // форма вызывается при определении трассы или из ориентиров
  // если из ориентиров и задана базовая или это последний узел трассы то нельзя выбирать Не использовать оборудование в этом узле
  canSelectNoEquipment!: boolean;

  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    private ts: TranslateService,
    private gisMapService: GisMapService,
    private graphService: GraphService
  ) {
    this.buttons = data.buttons;
    this.fromLandmarks = data.fromLandmarks;
    this.canSelectNoEquipment = !data.hasAnyBaseRef && !data.isLast;

    for (let i = 0; i < data.buttons.length; i++) {
      this.childForms.push(this.createChildForm(data.buttons[i]));
    }

    this.buttons.push({
      id: -1,
      title: this.ts.instant('i18n.ft.do-not-use-equipment'),
      isSelected: this.buttons.findIndex((b) => b.isSelected) === -1
    });

    this.node = data.node;

    this.form = new FormGroup({
      title: new FormControl({ value: this.node.title, disabled: this.fromLandmarks })
    });
  }

  ngAfterViewInit() {
    this.dragRef.setFreeDragPosition({ x: 290, y: 75 });
  }

  createChildForm(button: any): FormGroup {
    const equipmentType = (<GeoEquipment>button.equipment).type;
    const rightReserveDisabled =
      equipmentType === EquipmentType.CableReserve || equipmentType === EquipmentType.Terminal;

    const childFormGroup = new FormGroup({
      title: new FormControl(button.equipment.title),
      leftReserve: new FormControl(button.equipment.cableReserveLeft),
      rightReserve: new FormControl({
        value: button.equipment.cableReserveRight,
        disabled: rightReserveDisabled
      })
    });

    if (this.fromLandmarks) childFormGroup.disable();

    return childFormGroup;
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });
  }

  async onNext() {
    this.spinning.next(true);
    await this.saveNodeTitleChanges();
    await this.saveEquipmentChanges();
    this.spinning.next(false);

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
    const response = await this.graphService.sendCommandAsync(json, 'UpdateNode');
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
        button.equipment.title !== childForm.controls['title'].value ||
        button.equipment.cableReserveLeft !== childForm.controls['leftReserve'].value ||
        button.equipment.cableReserveRight !== childForm.controls['rightReserve'].value
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
        const response = await this.graphService.sendCommandAsync(json, 'UpdateEquipment');
        if (response.success) {
          button.equipment.title = childForm.controls['title'].value;
          button.equipment.cableReserveLeft = +childForm.controls['leftReserve'].value;
          button.equipment.cableReserveRight = +childForm.controls['rightReserve'].value;
        }
      }
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
