import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject } from '@angular/core';
import { EquipmentType } from 'src/grpc-generated';
import { GeoEquipment, GeoTrace, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GraphService } from 'src/app/core/grpc';
import { firstValueFrom } from 'rxjs';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { MapLayersActions } from '../../components/gis-actions/map-layers-actions';
import { MapEquipmentActions } from '../../components/gis-actions/map-equipment-actions';
import { Utils } from 'src/app/shared/utils/utils';

interface EquipElement {
  isSelected: boolean;
  equipment: GeoEquipment;
  usedByTraceWithBase: boolean;
}

interface TraceElement {
  isSelected: boolean;
  equipId: string | null; // id того оборудов которое вкл в эту трассу, или null если ничего не включено
  trace: GeoTrace;
}

@Component({
  selector: 'rtu-node-info-dialog',
  templateUrl: './node-info-dialog.component.html',
  styleUrls: ['./node-info-dialog.component.css']
})
export class NodeInfoDialogComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  gisMapService!: GisMapService;

  form!: FormGroup;
  nodeId!: string;
  nodeInWork!: TraceNode;

  equipTable!: EquipElement[];
  traceTable!: TraceElement[];

  constructor(@Inject(DIALOG_DATA) private data: any, private graphService: GraphService) {
    this.gisMapService = data.service;

    this.nodeId = data.nodeId;
    this.nodeInWork = this.gisMapService.getNode(this.nodeId);
    this.form = new FormGroup({
      title: new FormControl(this.nodeInWork.title, Validators.required),
      comment: new FormControl(this.nodeInWork.comment)
    });

    this.updateEquipmentAndTraces();
  }

  updateEquipmentAndTraces() {
    const equipments = this.gisMapService
      .getGeoData()
      .equipments.filter((e) => e.nodeId === this.nodeId && e.type !== EquipmentType.EmptyNode);

    if (equipments.length > 0) {
      this.equipTable = equipments.map((e) => {
        // в этом месте еще не знаем про трассы
        return { isSelected: false, equipment: e, usedByTraceWithBase: false };
      });
      this.equipTable[0].isSelected = true;
    }

    const tracesInNode = this.gisMapService
      .getGeoData()
      .traces.filter((t) => t.nodeIds.indexOf(this.nodeId) !== -1);

    this.traceTable = tracesInNode.map((t) => {
      return this.createTraceLine(t, equipments);
    });

    // помечаем то оборудование, которое используется трассами, для которых заданы базовые
    for (let i = 0; i < tracesInNode.length; i++) {
      const trace = tracesInNode[i];
      if (trace.hasAnyBaseRef) {
        const equipId = this.traceTable.find((t) => t.trace.id === trace.id)!.equipId;
        if (equipId !== null) {
          this.equipTable.find((e) => e.equipment.id === equipId)!.usedByTraceWithBase = true;
        }
      }
    }
  }

  createTraceLine(t: GeoTrace, equipments: GeoEquipment[]): TraceElement {
    for (let i = 0; i < equipments.length; i++) {
      const e = equipments[i];
      const eqId = t.equipmentIds.find((id) => id === e.id);
      if (eqId !== undefined) {
        return { isSelected: e.id === equipments[0].id, equipId: eqId, trace: t };
      }
    }
    return { isSelected: false, equipId: null, trace: t };
  }

  isTitleValid(): boolean {
    return this.form.controls['title'].pristine || this.form.controls['title'].valid;
  }

  isApplyDisabled(): boolean {
    if (this.form.pristine) return true;
    if (!this.form.valid) return true;

    return this.form.get('title')!.value === '';
  }

  async onApplyClicked() {
    const command = {
      NodeId: this.nodeId,
      Title: this.form.controls['title'].value,
      Comment: this.form.controls['comment'].value
    };
    const cmd = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(cmd, 'UpdateNode'));
    if (response.success) {
      this.nodeInWork.title = this.form.controls['title'].value;
      this.nodeInWork.comment = this.form.controls['comment'].value;

      const layerType = GisMapUtils.equipmentTypeToGisMapLayer(this.nodeInWork.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(layerType)!;
      const marker = group.getLayers().find((m) => (<any>m).id === this.nodeId);
      group.removeLayer(marker!);
      MapLayersActions.addNodeToLayer(this.nodeInWork);
    }

    // this.gisMapService.showNodeInfo.next(null);
    this.dialogRef.close();
  }

  onDiscardClicked() {
    // this.gisMapService.showNodeInfo.next(null);
    this.dialogRef.close();
  }

  // если оборудование входит в трассу для которой заданы базовые, то МОЖНО редактировать
  async editEquipment(equipment: any) {
    const dialogRef = await MapEquipmentActions.openEditEquipmentDialog(
      this.nodeId,
      equipment,
      false,
      []
    );
    dialogRef.closed.subscribe(async (result) => {
      if (result !== null) {
        const res = await MapEquipmentActions.applyEditEquipmentResult(<string>result, false);
        if (res) {
          this.updateEquipmentAndTraces();
        }
      }
    });
  }

  // если оборудование входит в трассу для которой заданы базовые, то НЕЛЬЗЯ удалять
  async removeEquipment(eqLine: EquipElement) {
    if (eqLine.usedByTraceWithBase) return;
    await MapEquipmentActions.removeEquipment(eqLine.equipment);
    this.updateEquipmentAndTraces();
  }

  async addEquipment() {
    const forTraces = await MapEquipmentActions.openSelectTracesDialog(this.nodeId);
    if (forTraces === null) return;

    const dialogRef = await MapEquipmentActions.openEditEquipmentDialog(
      this.nodeId,
      null,
      true,
      forTraces
    );
    dialogRef.closed.subscribe(async (result) => {
      if (result !== null) {
        const res = await MapEquipmentActions.applyEditEquipmentResult(<string>result, true);
        if (res) {
          this.updateEquipmentAndTraces();
        }
      }
    });
  }

  onEquipLineClick(line: EquipElement) {
    this.equipTable.forEach((l) => {
      l.isSelected = l.equipment.id === line.equipment.id;
    });

    this.traceTable.forEach((l) => {
      l.isSelected = l.equipId === line.equipment.id;
    });
  }
}
