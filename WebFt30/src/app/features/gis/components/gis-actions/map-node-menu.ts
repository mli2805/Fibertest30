import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import 'leaflet-contextmenu';
import { GisMapService } from '../../gis-map.service';
import { Injector } from '@angular/core';
import { EquipmentType } from 'src/grpc-generated';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc/services/graph.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GeoEquipment, GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from './map-layers-actions';
import { MapNodeRemove } from './map-node-remove';
import { MapEquipmentActions } from './map-equipment-actions';
import { Dialog } from '@angular/cdk/dialog';
import {
  SectionWithNodesComponent,
  WithNodesResult
} from '../../forms/section-with-nodes/section-with-nodes.component';
import { AddFiber } from './graph-commands';
import { FiberCommandsFactory } from './fiber-commands-factory';
import { MessageBoxUtils } from 'src/app/shared/components/message-box/message-box-utils';
import { MapRtuMenu } from './map-rtu-menu';

export class MapNodeMenu {
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

  static buildMarkerContextMenu(
    nodeId: string,
    equipmentType: EquipmentType,
    hasEditPermissions: boolean
  ): L.ContextMenuItem[] {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return MapRtuMenu.buildRtuContextMenu(hasEditPermissions, nodeId);
      case EquipmentType.AdjustmentPoint:
        return MapNodeMenu.buildAdjustmentPointContextMenu();
      default:
        return MapNodeMenu.buildNodeContextMenu(hasEditPermissions, nodeId);
    }
  }

  static buildNodeContextMenu(hasEditPermissions: boolean, nodeId: string): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e, hasEditPermissions)
      },
      {
        text: this.ts.instant('i18n.ft.add-equipment'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addEquipment(e),
        disabled: !hasEditPermissions
      },
      {
        text: this.ts.instant('i18n.ft.remove-node'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeNode(e),
        disabled: !hasEditPermissions || !this.canRemoveNode(nodeId)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e, false),
        disabled: !hasEditPermissions
      },
      {
        text: this.ts.instant('i18n.ft.section-with-nodes'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e, true),
        disabled: !hasEditPermissions
      }
    ];
  }

  static buildAdjustmentPointContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.remove'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeNode(e)
      }
    ];
  }

  static async showInformation(e: L.ContextMenuItemClickEvent, hasEditPermission: boolean) {
    const nodeId = (<any>e.relatedTarget).id;
    this.gisMapService.showNodeInfoDialog.next(nodeId);
  }

  static async addEquipment(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;

    const forTraces = await MapEquipmentActions.openSelectTracesDialog(nodeId);
    if (forTraces === null) return;

    const dialogRef = await MapEquipmentActions.openEditEquipmentDialog(
      nodeId,
      null,
      true,
      forTraces
    );
    dialogRef.closed.subscribe((result) => {
      if (result !== null) {
        MapEquipmentActions.applyEditEquipmentResult(<string>result, true);
      }
    });
  }

  // 1 не должно быть базовых
  // 2 не последний узел в трассе
  static canRemoveNode(nodeId: string): boolean {
    const idx = this.gisMapService
      .getGeoData()
      .traces.findIndex(
        (t) => t.nodeIds.includes(nodeId) && (t.hasAnyBaseRef || t.nodeIds.at(-1) === nodeId)
      );
    return idx === -1;
  }

  static hasAdjustmentPointNeighbour(nodeId: string): boolean {
    const fibers = this.gisMapService
      .getGeoData()
      .fibers.filter((f) => f.node1id === nodeId || f.node2id === nodeId);

    for (const f of fibers) {
      const neighbourId = f.node1id === nodeId ? f.node2id : f.node1id;
      if (this.gisMapService.getNode(neighbourId).equipmentType === EquipmentType.AdjustmentPoint)
        return true;
    }

    return false;
  }

  // из трассы можно удалять не последний узел - будет построен обход
  // но рядом с узлом не должно быть точек привязки - в этом случае выводится сообщение и выходим
  static async removeNode(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;

    if (this.hasAdjustmentPointNeighbour(nodeId)) {
      MessageBoxUtils.show(this.dialog, 'Information', [
        {
          message: 'i18n.ft.remove-adjustment-points-or-add-nodes',
          bold: true,
          bottomMargin: true
        },
        {
          message: 'i18n.ft.next-to-the-node-your-are-going-to-remove',
          bold: true,
          bottomMargin: false
        }
      ]);
      return;
    }

    this.gisMapService.geoDataLoading.next(true);
    const node = this.gisMapService.getGeoData().nodes.find((n) => n.id === nodeId);

    if (!MapNodeRemove.isRemoveThisNodePermitted(nodeId, node!.equipmentType)) return;
    if (!MapNodeRemove.isPossibleToRemove(nodeId)) return;

    const detours = [];
    for (let i = 0; i < this.gisMapService.getGeoData().traces.length; i++) {
      const trace = this.gisMapService.getGeoData().traces[i];
      const traceDetours = MapNodeRemove.buildDetoursForTrace(nodeId, trace);
      detours.push(...traceDetours);
    }
    const isAdjustmentPoint = node?.equipmentType === EquipmentType.AdjustmentPoint;
    const fiberIdToDetourAdjustmentPoint =
      isAdjustmentPoint && detours.length === 0 ? crypto.randomUUID() : GisMapUtils.emptyGuid;

    const command = {
      NodeId: nodeId,
      IsAdjustmentPoint: isAdjustmentPoint,
      DetoursForGraph: detours,
      FiberIdToDetourAdjustmentPoint: fiberIdToDetourAdjustmentPoint
    };
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'RemoveNode'));
    if (response.success) {
      // сначала рисуем новые волокна трассам, если таковые проходили через узел
      const traces = this.gisMapService.getGeoData().traces;
      for (let i = 0; i < traces.length; i++) {
        MapNodeRemove.ExcludeAllNodeAppearancesInTrace(nodeId, traces[i], detours);
      }

      if (fiberIdToDetourAdjustmentPoint !== GisMapUtils.emptyGuid) {
        MapNodeRemove.ExcludeAdjustmentPoint(nodeId, fiberIdToDetourAdjustmentPoint);
      } else {
        if (detours.length === 0) {
          MapNodeRemove.RemoveNodeWithAllHisFibersUptoRealNode(node!);
        } else {
          MapNodeRemove.RemoveNodeWithAllHisFibers(node!);
        }
      }
    }
    this.gisMapService.geoDataLoading.next(false);
  }

  static drawSection(e: L.ContextMenuItemClickEvent, withNodes: boolean) {
    const nodeId = (<any>e.relatedTarget).id;
    // это мы только ставим флаги что на данном узле пользователь кликнул добавить волокно
    // само добавление произойдет по клику на другом узле
    this.gisMapService.addSectionMode = true;
    this.gisMapService.sectionWithNodes = withNodes;
    this.gisMapService.addSectionFromNodeId = nodeId;
    this.gisMapService.addSectionFromCoors = e.latlng;
  }

  static async addNewFiber(endNodeId: string) {
    this.gisMapService.geoDataLoading.next(true);
    const beginNode = this.gisMapService.getNode(this.gisMapService.addSectionFromNodeId);
    const endNode = this.gisMapService.getNode(endNodeId);

    if (endNode.equipmentType !== EquipmentType.AdjustmentPoint) {
      if (this.gisMapService.sectionWithNodes) {
        // с узлами
        await this.sendWithNodesApplySuccess(beginNode, endNode);
      } else {
        // без узлов
        await this.sendAddFiberApplySuccess(beginNode, endNode);
      }
    }

    // сбрасываем флаги в сервисе
    this.gisMapService.addSectionMode = false;
    this.gisMapService.sectionWithNodes = false;
    this.gisMapService.addSectionFromNodeId = GisMapUtils.emptyGuid;
    this.gisMapService.geoDataLoading.next(false);
  }

  static async sendAddFiberApplySuccess(beginNode: TraceNode, endNode: TraceNode) {
    // создаем команду
    const fiberId = crypto.randomUUID();
    const beginNodeId = this.gisMapService.addSectionFromNodeId;
    const command = new AddFiber(fiberId, beginNodeId, endNode.id);

    // отправляем команду на сервер
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'AddFiber'));
    if (response.success) {
      // добавить новое волокно на карту и в GeoData
      const fiber = new GeoFiber(
        fiberId,
        beginNode.id,
        beginNode.coors,
        endNode.id,
        endNode.coors,
        []
      );
      MapLayersActions.addFiberToLayer(fiber);
      this.gisMapService.getGeoData().fibers.push(fiber);
    }
  }

  static async sendWithNodesApplySuccess(beginNode: TraceNode, endNode: TraceNode) {
    const result = await this.askWithNodes();
    if (result === null) return;
    const command = FiberCommandsFactory.createFiberWithNodesCommand(
      beginNode,
      endNode,
      result.quantity,
      result.type
    );

    // отправляем команду на сервер
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'AddFiberWithNodes'));
    if (response.success) {
      // добавить новые волокна и узлы на карту и в GeoData
      for (let i = 0; i < command.AddEquipments.length; i++) {
        const cmd = command.AddEquipments[i];
        const node = new TraceNode(
          cmd.NodeId,
          '',
          L.latLng(cmd.Latitude, cmd.Longitude),
          cmd.Type,
          ''
        );
        MapLayersActions.addNodeToLayer(node);
        this.gisMapService.getGeoData().nodes.push(node);
        const equipment = new GeoEquipment(
          cmd.RequestedEquipmentId,
          '',
          cmd.NodeId,
          cmd.Type,
          0,
          0,
          ''
        );
        this.gisMapService.getGeoData().equipments.push(equipment);
      }

      for (let i = 0; i < command.AddFibers.length; i++) {
        const cmd = command.AddFibers[i];
        const coor1 =
          i === 0
            ? beginNode.coors
            : L.latLng(
                command.AddEquipments[i - 1].Latitude,
                command.AddEquipments[i - 1].Longitude
              );
        const coor2 =
          i === command.AddFibers.length - 1
            ? endNode.coors
            : L.latLng(command.AddEquipments[i].Latitude, command.AddEquipments[i].Longitude);
        const fiber = new GeoFiber(cmd.FiberId, cmd.NodeId1, coor1, cmd.NodeId2, coor2, []);
        MapLayersActions.addFiberToLayer(fiber);
        this.gisMapService.getGeoData().fibers.push(fiber);
      }
    }
  }

  static async askWithNodes(): Promise<WithNodesResult | null> {
    const dialogRef = this.dialog.open(SectionWithNodesComponent, {
      disableClose: true
    });

    return <WithNodesResult | null>await firstValueFrom(dialogRef.closed);
  }
}
