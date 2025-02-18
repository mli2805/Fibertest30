import { Dialog } from '@angular/cdk/dialog';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GraphService } from 'src/app/core/grpc';
import { GisMapService } from '../../gis-map.service';
import { Utils } from 'src/app/shared/utils/utils';
import { GeoEquipment } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from './map-layers-actions';
import { firstValueFrom } from 'rxjs';
import { EditEquipmentDialogComponent } from '../../forms/edit-equipment-dialog/edit-equipment-dialog.component';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GisMapLayer } from '../../models/gis-map-layer';
import { EquipmentType } from 'src/grpc-generated';

export class MapEquipmentActions {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;
  private static graphService: GraphService;
  private static dialog: Dialog;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
    this.dialog = injector.get(Dialog);
  }

  static openEditEquipmentDialog(nodeId: string, equipment: GeoEquipment | null, addMode: boolean) {
    this.dialog
      .open(EditEquipmentDialogComponent, {
        maxHeight: '95vh',
        maxWidth: '95vw',
        disableClose: true,
        data: { nodeId, equipment, addMode }
      })
      .closed.subscribe((result) => {
        if (result !== null) {
          this.applyEditEquipmentResult(<string>result, addMode);
        }
      });
  }

  static async applyEditEquipmentResult(json: string, addMode: boolean) {
    const command = JSON.parse(json);
    const commandType = addMode ? 'AddEquipmentIntoNode' : 'UpdateEquipment';
    const response = await firstValueFrom(this.graphService.sendCommand(json, commandType));
    if (response.success) {
      const node = this.gisMapService.getNode(command.NodeId);

      const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(layerType)!;
      const marker = group.getLayers().find((m) => (<any>m).id === command.NodeId);
      group.removeLayer(marker!);

      if (addMode) {
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
      } else {
        const equipment = this.gisMapService
          .getGeoData()
          .equipments.find((e) => e.id === command.EquipmentId)!;
        equipment.title = command.Title;
        equipment.nodeId = command.NodeId;
        equipment.type = command.Type;
        equipment.cableReserveLeft = command.CableReserveLeft;
        equipment.cableReserveRight = command.CableReserveRight;
        equipment.comment = command.Comment;
      }

      node.equipmentType = command.Type;
      MapLayersActions.addNodeToLayer(node);

      await this.refreshNodeInfoIfOpen();
    }
  }

  static async removeEquipment(equipment: GeoEquipment) {
    const command = {
      EquipmentId: equipment.id,
      NodeId: equipment.nodeId
    };
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'RemoveEquipment'));
    if (response.success) {
      // удаляем оборудование
      const index = this.gisMapService.getGeoData().equipments.indexOf(equipment);
      this.gisMapService.getGeoData().equipments.splice(index, 1);

      const node = this.gisMapService.getNode(command.NodeId);

      // возможно удаляется не то оборудование от которого иконка
      //   const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(GisMapLayer.TraceEquipment)!;
      const marker = group.getLayers().find((m) => (<any>m).id === command.NodeId);
      group.removeLayer(marker!);

      // если в узле было единственное реальное оборудование,
      // то будет найдено оборудование с типом EmptyNode
      const eqs = this.gisMapService
        .getGeoData()
        .equipments.filter((e) => e.nodeId === command.NodeId);

      console.log(eqs);
      if (eqs.length === 1) {
        node.equipmentType = EquipmentType.EmptyNode;
      } else {
        const index = eqs.findIndex((e) => e.type !== EquipmentType.EmptyNode);
        node.equipmentType = eqs[index].type;
      }
      MapLayersActions.addNodeToLayer(node);

      await this.refreshNodeInfoIfOpen();
    }
  }

  static async refreshNodeInfoIfOpen() {
    if (this.gisMapService.showNodeInfo.value !== null) {
      const nodeId = this.gisMapService.showNodeInfo.value;
      this.gisMapService.showNodeInfo.next(null);
      await Utils.delay(50);
      this.gisMapService.showNodeInfo.next(nodeId);
    }
  }
}
