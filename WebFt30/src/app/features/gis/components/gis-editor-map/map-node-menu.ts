import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import { GisMapService } from '../../gis-map.service';
import { Injector } from '@angular/core';
import { EquipmentType } from 'src/grpc-generated';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc/services/graph.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GeoFiber } from 'src/app/core/store/models/ft30/geo-data';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { MapLayersActions } from './map-layers-actions';
import { GisMapLayer } from '../../models/gis-map-layer';

export class MapNodeMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
  }

  static buildMarkerContextMenu(equipmentType: EquipmentType): L.ContextMenuItem[] {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return MapNodeMenu.buildRtuContextMenu();
      case EquipmentType.AdjustmentPoint:
        return MapNodeMenu.buildAdjustmentPointContextMenu();
      default:
        return MapNodeMenu.buildNodeContextMenu();
    }
  }

  static buildRtuContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.define-trace'),
        callback: (e: L.ContextMenuItemClickEvent) => this.defineTrace(e)
      }
    ];
  }

  static buildNodeContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-equipment'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addEquipment(e)
      },
      {
        text: this.ts.instant('i18n.ft.remove-node'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeNode(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
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

  static showInformation(e: L.ContextMenuItemClickEvent) {
    console.log(e);
    console.log(e.relatedTarget);
  }

  static addEquipment(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  static async removeNode(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;

    const command = {
      NodeId: nodeId
    };
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'RemoveNode'));
    if (response.success) {
      const node = this.gisMapService.getGeoData().nodes.find((n) => n.id === nodeId);
      const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node!.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(layerType);
      const marker = group?.getLayers().find((m) => (<any>m).id === nodeId);
      group?.removeLayer(marker!);

      const routesGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route);
      this.gisMapService.getGeoData().fibers.forEach((f) => {
        if (f.node1id === nodeId || f.node2id === nodeId) {
          const route = routesGroup!.getLayers().find((r) => (<any>r).id === f.id);
          routesGroup!.removeLayer(route!);
        }
      });
    }
  }

  static drawSection(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;

    console.log(nodeId);
    const node1 = this.gisMapService.getGeoData().nodes.find((n) => n.id === nodeId);
    console.log(node1);

    this.gisMapService.addSectionMode = true;
    this.gisMapService.addSectionFromNodeId = nodeId;
  }

  static async addNewFiber(endNodeId: string) {
    const fiberId = crypto.randomUUID();
    const beginNodeId = this.gisMapService.addSectionFromNodeId;
    const command = {
      FiberId: fiberId,
      NodeId1: beginNodeId,
      NodeId2: endNodeId
    };

    this.gisMapService.addSectionMode = false;
    this.gisMapService.addSectionFromNodeId = GisMapUtils.emptyGuid;
    console.log(beginNodeId);

    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'AddFiber'));
    if (response.success) {
      const node1 = this.gisMapService.getGeoData().nodes.find((n) => n.id === beginNodeId);
      console.log(node1);
      const node2 = this.gisMapService.getGeoData().nodes.find((n) => n.id === endNodeId);
      console.log(node2);
      const fiber = new GeoFiber(
        fiberId,
        beginNodeId,
        node1!.coors,
        endNodeId,
        node2!.coors,
        FiberState.NotInTrace
      );
      MapLayersActions.addFiberToLayer(fiber);
    }
  }

  static defineTrace(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    console.log(nodeId);
    this.gisMapService.showTraceDefine.next(true);
  }
}
