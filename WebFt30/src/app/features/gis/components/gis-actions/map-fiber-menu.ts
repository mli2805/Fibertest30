import * as L from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { EquipmentType } from 'src/grpc-generated';
import { GraphService } from 'src/app/core/grpc';
import { GeoEquipment, GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from './map-layers-actions';
import { GisMapLayer } from '../shared/gis-map-layer';
import { MapNodeRemove } from './map-node-remove';

export class MapFiberMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
  }

  static buildFiberContextMenu(hasEditPermissions: boolean, fiberId: string): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showSectionInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-node'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addNodeToSection(e),
        disabled: !hasEditPermissions || !this.canAddNodeToSection(fiberId)
      },
      {
        text: this.ts.instant('i18n.ft.add-adjustment-point'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addPointToSection(e),
        disabled: !hasEditPermissions
      },
      {
        text: this.ts.instant('i18n.ft.remove-section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeSection(e),
        disabled: !hasEditPermissions || !this.canRemoveSection(fiberId)
      }
    ];
  }

  static showSectionInformation(e: L.ContextMenuItemClickEvent) {
    console.log(e.relatedTarget);
  }

  // только если трассы без базовых
  static canAddNodeToSection(fiberId: string): boolean {
    const idx = this.gisMapService
      .getGeoData()
      .traces.findIndex((t) => t.fiberIds.includes(fiberId) && t.hasAnyBaseRef);
    return idx === -1;
  }

  static async addNodeToSection(e: L.ContextMenuItemClickEvent) {
    await this.addToSection(e, EquipmentType.EmptyNode);
  }

  // можно всегда, даже если есть базовые в трассах
  static async addPointToSection(e: L.ContextMenuItemClickEvent) {
    await this.addToSection(e, EquipmentType.AdjustmentPoint);
  }

  static async addToSection(e: L.ContextMenuItemClickEvent, eqType: EquipmentType) {
    this.gisMapService.geoDataLoading.next(true);
    const fiberId = (<any>e.relatedTarget).id;
    const oldFiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;

    const command = {
      Id: crypto.randomUUID(),
      EquipmentId: crypto.randomUUID(),
      Position: { Lat: e.latlng.lat, Lng: e.latlng.lng },
      InjectionType: eqType,
      FiberId: fiberId,
      NewFiberId1: crypto.randomUUID(),
      NewFiberId2: crypto.randomUUID()
    };
    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'AddNodeIntoFiber');
    if (response.success) {
      // добавить этот узел на карту и в GeoData
      const traceNode = new TraceNode(command.Id, '', e.latlng, eqType, '');
      MapLayersActions.addNodeToLayer(traceNode);
      this.gisMapService.getGeoData().nodes.push(traceNode);
      const equipment = new GeoEquipment(command.EquipmentId, '', command.Id, eqType, 0, 0, '');
      this.gisMapService.getGeoData().equipments.push(equipment);

      // добавить 2 новых волокна на карту и в GeoData
      const newFiber1 = new GeoFiber(
        command.NewFiberId1,
        oldFiber.node1id,
        oldFiber.coors1,
        command.Id,
        e.latlng,
        oldFiber.states
      );
      const newFiber2 = new GeoFiber(
        command.NewFiberId2,
        command.Id,
        e.latlng,
        oldFiber.node2id,
        oldFiber.coors2,
        oldFiber.states
      );

      MapLayersActions.addFiberToLayer(newFiber1);
      MapLayersActions.addFiberToLayer(newFiber2);
      this.gisMapService.getGeoData().fibers.push(newFiber1);
      this.gisMapService.getGeoData().fibers.push(newFiber2);

      // удалить старое волокно с карты и из GeoData
      const routeGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
      const oldRouteLayer = routeGroup.getLayers().find((r) => (<any>r).id === fiberId);
      routeGroup.removeLayer(oldRouteLayer!);
      const indexOfFiber = this.gisMapService.getGeoData().fibers.indexOf(oldFiber);
      if (indexOfFiber > -1) {
        this.gisMapService.getGeoData().fibers.splice(indexOfFiber, 1);
      }

      this.fixTracesPassingOldFiber(
        oldFiber,
        newFiber1,
        newFiber2,
        command.Id,
        command.EquipmentId
      );
    }
    this.gisMapService.geoDataLoading.next(false);
  }

  static fixTracesPassingOldFiber(
    oldFiber: GeoFiber,
    newFiber1: GeoFiber,
    newFiber2: GeoFiber,
    nodeId: string,
    equipmentId: string
  ) {
    oldFiber.states.forEach((s) => {
      const trace = this.gisMapService.getGeoData().traces.find((t) => t.id === s.traceId);
      if (trace === undefined) return;

      const oldNodesArray = trace.nodeIds.slice();
      const oldFibersArray = trace.fiberIds.slice();
      const oldEquipmentsArray = trace.equipmentIds.slice();

      trace.fiberIds.length = 0;
      trace.nodeIds.length = 0;
      trace.nodeIds.push(oldNodesArray[0]);
      trace.equipmentIds.length = 0;
      trace.equipmentIds.push(oldEquipmentsArray[0]);

      for (let i = 0; i < oldFibersArray.length; i++) {
        if (oldFibersArray[i] !== oldFiber.id) {
          trace.fiberIds.push(oldFibersArray[i]);
          trace.nodeIds.push(oldNodesArray[i + 1]);
          trace.equipmentIds.push(oldEquipmentsArray[i + 1]);
        } else {
          const first =
            newFiber1.node1id === trace.nodeIds.at(-1) || newFiber2.node1id === trace.nodeIds.at(-1)
              ? newFiber1
              : newFiber2;
          const second = first.id === newFiber1.id ? newFiber2 : newFiber1;
          trace.fiberIds.push(first.id);
          trace.fiberIds.push(second.id);
          trace.nodeIds.push(nodeId);
          trace.nodeIds.push(oldNodesArray[i + 1]);
          trace.equipmentIds.push(equipmentId);
          trace.equipmentIds.push(oldEquipmentsArray[i + 1]);
        }
      }
    });
  }

  // если не проходят трассы
  static canRemoveSection(fiberId: string): boolean {
    const idx = this.gisMapService
      .getGeoData()
      .traces.findIndex((t) => t.fiberIds.includes(fiberId));
    return idx === -1;
  }

  static async removeSection(e: L.ContextMenuItemClickEvent) {
    this.gisMapService.geoDataLoading.next(true);
    const fiberId = (<any>e.relatedTarget).id;

    const oldFiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;

    const command = {
      FiberId: fiberId
    };
    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'RemoveFiber');
    if (response.success) {
      // если один из концов волокна - точка привязки, то удаляем её и продолжение после неё и т.д.
      const toTheLeft = this.toOneSide(oldFiber.node1id, oldFiber.id);
      const toTheRight = this.toOneSide(oldFiber.node2id, oldFiber.id);

      const fibersToRemove = [oldFiber, toTheLeft.fibers, toTheRight.fibers].flat();
      const nodesToRemove = [toTheLeft.adjustmentPoints, toTheRight.adjustmentPoints].flat();

      fibersToRemove.forEach((f) => {
        this.removeFiberFromMapAndGeoData(f);
      });
      nodesToRemove.forEach((n) => {
        MapNodeRemove.removeNodeFromMapAndGeoData(n);
      });
    }
    this.gisMapService.geoDataLoading.next(false);
  }

  static removeFiberFromMapAndGeoData(oldFiber: GeoFiber) {
    const routeGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    const oldRouteLayer = routeGroup.getLayers().find((r) => (<any>r).id === oldFiber.id);
    routeGroup.removeLayer(oldRouteLayer!);
    const indexOfFiber = this.gisMapService.getGeoData().fibers.indexOf(oldFiber);
    if (indexOfFiber > -1) {
      this.gisMapService.getGeoData().fibers.splice(indexOfFiber, 1);
    }
  }

  static toOneSide(nodeId: string, fromFiberId: string) {
    const fibers = [];
    const adjustmentPoints = [];

    let node = this.gisMapService.getNode(nodeId);
    while (node.equipmentType === EquipmentType.AdjustmentPoint) {
      const moreFiber = this.gisMapService.getAnotherFiberOfAdjustmentPoint(node.id, fromFiberId);
      fibers.push(moreFiber);
      adjustmentPoints.push(node);
      node = this.gisMapService.getNode(
        moreFiber.node1id === node.id ? moreFiber.node2id : moreFiber.node1id
      );
      fromFiberId = moreFiber.id;
    }

    return { fibers, adjustmentPoints };
  }
}
