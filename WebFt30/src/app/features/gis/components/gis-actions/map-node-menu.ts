import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import 'leaflet-contextmenu';
import { GisMapService } from '../../gis-map.service';
import { Injector } from '@angular/core';
import { EquipmentType } from 'src/grpc-generated';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc/services/graph.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GeoFiber } from 'src/app/core/store/models/ft30/geo-data';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { MapLayersActions } from './map-layers-actions';
import { MapNodeRemove } from './map-node-remove';
import { StepModel } from '../../forms/trace-define/step-model';
import { MapEquipmentActions } from './map-equipment-actions';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { NodeInfoDialogComponent } from '../../forms/node-info-dialog/node-info-dialog.component';

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
    equipmentType: EquipmentType,
    hasEditPermissions: boolean
  ): L.ContextMenuItem[] {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return MapNodeMenu.buildRtuContextMenu(hasEditPermissions);
      case EquipmentType.AdjustmentPoint:
        return MapNodeMenu.buildAdjustmentPointContextMenu();
      default:
        return MapNodeMenu.buildNodeContextMenu(hasEditPermissions);
    }
  }

  static buildRtuContextMenu(hasEditPermissions: boolean): L.ContextMenuItem[] {
    if (hasEditPermissions) {
      return [
        {
          text: this.ts.instant('i18n.ft.information'),
          callback: (e: L.ContextMenuItemClickEvent) => this.showRtuInformation(e)
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
    } else {
      return [
        {
          text: this.ts.instant('i18n.ft.information'),
          callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e, hasEditPermissions)
        }
      ];
    }
  }

  static buildNodeContextMenu(hasEditPermissions: boolean): L.ContextMenuItem[] {
    if (hasEditPermissions) {
      return [
        {
          text: this.ts.instant('i18n.ft.information'),
          callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e, hasEditPermissions)
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
    } else {
      return [
        {
          text: this.ts.instant('i18n.ft.information'),
          callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e, hasEditPermissions)
        }
      ];
    }
  }

  static buildAdjustmentPointContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.remove'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeNode(e)
      }
    ];
  }

  static async showRtuInformation(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    console.log(nodeId);
  }

  static async showInformation(e: L.ContextMenuItemClickEvent, hasEditPermission: boolean) {
    const nodeId = (<any>e.relatedTarget).id;

    const dialogConfig = new DialogConfig<unknown, DialogRef>();
    dialogConfig.positionStrategy = new GlobalPositionStrategy().left('20px').top('50px');
    dialogConfig.disableClose = true;
    dialogConfig.data = { nodeId, service: this.gisMapService, hasEditPermission };
    const dialogRef = this.dialog.open(NodeInfoDialogComponent, dialogConfig);
    await firstValueFrom(dialogRef.closed);
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

  static async removeNode(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    const node = this.gisMapService.getGeoData().nodes.find((n) => n.id === nodeId);

    if (!MapNodeRemove.isRemoveThisNodePermitted(nodeId, node!.equipmentType)) return;
    if (!MapNodeRemove.isPossibleToRemove(nodeId)) return;

    let detours: any[] = [];
    for (let i = 0; i < this.gisMapService.getGeoData().traces.length; i++) {
      const trace = this.gisMapService.getGeoData().traces[i];
      const traceDetours = MapNodeRemove.buildDetoursForTrace(nodeId, trace);
      detours = [...traceDetours];
    }

    const isAdjustmentPoint = node?.equipmentType === EquipmentType.AdjustmentPoint;
    const fiberIdToDetourAdjustmentPoint = isAdjustmentPoint
      ? crypto.randomUUID()
      : GisMapUtils.emptyGuid;

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
  }

  static drawSection(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    // это мы только ставим флаги что на данном узле пользователь кликнул добавить волокно
    // само добавление произойдет по клику на другом узле
    this.gisMapService.addSectionMode = true;
    this.gisMapService.addSectionFromNodeId = nodeId;
    this.gisMapService.addSectionFromCoors = e.latlng;
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

    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'AddFiber'));
    if (response.success) {
      // добавить новое волокно на карту и в GeoData
      const node1 = this.gisMapService.getGeoData().nodes.find((n) => n.id === beginNodeId);
      const node2 = this.gisMapService.getGeoData().nodes.find((n) => n.id === endNodeId);
      const fiber = new GeoFiber(
        fiberId,
        beginNodeId,
        node1!.coors,
        endNodeId,
        node2!.coors,
        FiberState.NotInTrace
      );
      MapLayersActions.addFiberToLayer(fiber);
      this.gisMapService.getGeoData().fibers.push(fiber);
    }
  }

  static defineTrace(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    const node = this.gisMapService.getNode(nodeId);

    this.gisMapService.setHighlightNode(nodeId);
    this.gisMapService.showTraceDefine.next(nodeId);

    this.gisMapService.clearSteps();
    const firstStepRtu = new StepModel();
    firstStepRtu.nodeId = nodeId;
    firstStepRtu.title = node!.title;
    firstStepRtu.equipmentId = this.gisMapService
      .getGeoData()
      .equipments.find((e) => e.nodeId === nodeId)!.id;
    this.gisMapService.addStep(firstStepRtu);
  }
}
