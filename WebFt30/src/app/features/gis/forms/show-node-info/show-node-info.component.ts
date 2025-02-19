import { Component } from '@angular/core';
import { GraphService } from 'src/app/core/grpc';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeoEquipment, GeoTrace, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { EquipmentType } from 'src/grpc-generated';
import { firstValueFrom } from 'rxjs';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { MapLayersActions } from '../../components/gis-editor-map/map-layers-actions';
import { MapEquipmentActions } from '../../components/gis-editor-map/map-equipment-actions';

interface EquipElement {
  isSelected: boolean;
  equipment: GeoEquipment;
}

interface TraceElement {
  isSelected: boolean;
  equipId: string | null; // id того оборудов которое вкл в эту трассу, или null если ничего не включено
  trace: GeoTrace;
}

@Component({
  selector: 'rtu-show-node-info',
  templateUrl: './show-node-info.component.html',
  styleUrls: ['./show-node-info.component.css']
})
export class ShowNodeInfoComponent {
  form!: FormGroup;
  nodeId!: string;
  nodeInWork!: TraceNode;

  // equipments!: GeoEquipment[];
  equipTable!: EquipElement[];
  // traces!: GeoTrace[];
  traceTable!: TraceElement[];

  constructor(public gisMapService: GisMapService, private graphService: GraphService) {
    this.nodeId = gisMapService.showNodeInfo.value!;
    this.nodeInWork = gisMapService.getNode(this.nodeId);
    this.form = new FormGroup({
      title: new FormControl(this.nodeInWork.title, Validators.required),
      comment: new FormControl(this.nodeInWork.comment)
    });

    const equipments = gisMapService
      .getGeoData()
      .equipments.filter((e) => e.nodeId === this.nodeId && e.type !== EquipmentType.EmptyNode);

    if (equipments.length > 0) {
      this.equipTable = equipments.map((e) => {
        return { isSelected: false, equipment: e };
      });
      this.equipTable[0].isSelected = true;
    }

    const traces = gisMapService
      .getGeoData()
      .traces.filter((t) => t.nodeIds.indexOf(this.nodeId) !== -1);

    this.traceTable = traces.map((t) => {
      return this.createTraceLine(t, equipments);
    });
    console.log(this.traceTable);
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

    this.gisMapService.showNodeInfo.next(null);
  }

  onDiscardClicked() {
    this.gisMapService.showNodeInfo.next(null);
  }

  // если оборудование входит в трассу для которой заданы базовые, то МОЖНО редактировать
  editEquipment(equipment: any) {
    MapEquipmentActions.openEditEquipmentDialog(this.nodeId, equipment, false);
  }

  // если оборудование входит в трассу для которой заданы базовые, то НЕЛЬЗЯ удалять
  async removeEquipment(equipment: GeoEquipment) {
    await MapEquipmentActions.removeEquipment(equipment);
  }

  addEquipment() {
    MapEquipmentActions.openEditEquipmentDialog(this.nodeId, null, true);
  }

  onEquipLineClick(line: EquipElement) {
    console.log(line);
    this.equipTable.forEach((l) => {
      l.isSelected = l.equipment.id === line.equipment.id;
    });

    this.traceTable.forEach((l) => {
      l.isSelected = l.equipId === line.equipment.id;
    });
  }
}
