import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { GraphService } from 'src/app/core/grpc';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeoEquipment, GeoTrace, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { EquipmentType } from 'src/grpc-generated';
import { firstValueFrom } from 'rxjs';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { MapLayersActions } from '../../components/gis-editor-map/map-layers-actions';

@Component({
  selector: 'rtu-show-node-info',
  templateUrl: './show-node-info.component.html',
  styleUrls: ['./show-node-info.component.css']
})
export class ShowNodeInfoComponent {
  form!: FormGroup;
  nodeId!: string;
  nodeInWork!: TraceNode;

  equipments!: GeoEquipment[];
  traces!: GeoTrace[];

  constructor(public gisMapService: GisMapService, private graphService: GraphService) {
    this.nodeId = gisMapService.showNodeInfo.value!;
    this.nodeInWork = gisMapService.getNode(this.nodeId);
    this.form = new FormGroup({
      title: new FormControl(this.nodeInWork.title, Validators.required),
      comment: new FormControl(this.nodeInWork.comment)
    });

    this.equipments = gisMapService
      .getGeoData()
      .equipments.filter((e) => e.nodeId === this.nodeId && e.type !== EquipmentType.EmptyNode);
    this.traces = gisMapService
      .getGeoData()
      .traces.filter((t) => t.nodeIds.indexOf(this.nodeId) !== -1);
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

  editEquipment(equipment: any) {
    console.log(equipment);
  }
}
