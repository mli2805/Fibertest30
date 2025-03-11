import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GraphService } from 'src/app/core/grpc';
import { GisMapService } from '../../gis-map.service';
import { GeoEquipment } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from './map-layers-actions';
import { firstValueFrom } from 'rxjs';
import { EditEquipmentDialogComponent } from '../../forms/edit-equipment-dialog/edit-equipment-dialog.component';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GisMapLayer } from '../shared/gis-map-layer';
import { EquipmentType } from 'src/grpc-generated';
import { MultiSelectionButton } from 'src/app/shared/components/svg-buttons/multi-selection-button/multi-selection-button';
import { SelectTracesDialogComponent } from '../../forms/select-traces-dialog/select-traces-dialog.component';

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

  static getTraceSelector(nodeId: string): MultiSelectionButton[] {
    const tracesInNode = this.gisMapService
      .getGeoData()
      .traces.filter((t) => t.nodeIds.indexOf(nodeId) !== -1);

    let id = 0;
    return tracesInNode.map((t) => {
      id++;
      return { id, isSelected: false, title: t.title, isDisabled: t.hasAnyBaseRef, traceId: t.id };
    });
  }

  static async openSelectTracesDialog(nodeId: string): Promise<string[] | null> {
    const traceTable = this.getTraceSelector(nodeId);
    if (traceTable.length === 0) return [];

    const dialogRef = this.dialog.open(SelectTracesDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { traceTable }
    });

    // такой подход позволяет дождаться результата
    // взаимодействия пользователя с диалогом
    // и только потом продолжить работу программы
    const result = await firstValueFrom(dialogRef.closed);
    return <string[] | null>result;
  }

  static async openEditEquipmentDialog(
    nodeId: string,
    equipment: GeoEquipment | null,
    addMode: boolean,
    traceForInsertion: string[]
  ): Promise<DialogRef<unknown, EditEquipmentDialogComponent>> {
    const dialogRef = this.dialog.open(EditEquipmentDialogComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { nodeId, equipment, addMode, traceForInsertion }
    });

    return dialogRef;
  }

  // послать и если успех - применить к карте и geoData
  // если не возвращать ничего, то await не ждет исполнения ф-ции
  static async applyEditEquipmentResult(json: string, addMode: boolean): Promise<boolean> {
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

        const traceForInsertion = command.TracesForInsertion;
        for (let i = 0; i < traceForInsertion.length; i++) {
          const traceId = traceForInsertion[i];
          const trace = this.gisMapService.getGeoData().traces.find((t) => t.id === traceId)!;
          const index = trace.nodeIds.indexOf(command.NodeId);
          trace.equipmentIds[index] = command.EquipmentId;
        }
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
    }
    return true;
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
    }
  }
}
