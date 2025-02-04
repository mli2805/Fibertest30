import * as L from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { EquipmentType } from 'src/grpc-generated';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from './map-layers-actions';
import { GisMapLayer } from '../../models/gis-map-layer';

export class MapFiberMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
  }

  static buildFiberContextMenu(hasEditPermissions: boolean): L.ContextMenuItem[] {
    if (hasEditPermissions) {
      return [
        {
          text: this.ts.instant('i18n.ft.information'),
          callback: (e: L.ContextMenuItemClickEvent) => this.showSectionInformation(e)
        },
        {
          text: this.ts.instant('i18n.ft.add-node'),
          callback: (e: L.ContextMenuItemClickEvent) => this.addNodeToSection(e)
        },
        {
          text: this.ts.instant('i18n.ft.add-adjustment-point'),
          callback: (e: L.ContextMenuItemClickEvent) => this.addPointToSection(e)
        },
        {
          text: this.ts.instant('i18n.ft.remove-section'),
          callback: (e: L.ContextMenuItemClickEvent) => this.removeSection(e)
        }
      ];
    } else {
      return [
        {
          text: this.ts.instant('i18n.ft.information'),
          callback: (e: L.ContextMenuItemClickEvent) => this.showSectionInformation(e)
        }
      ];
    }
  }

  static showSectionInformation(e: L.ContextMenuItemClickEvent) {
    // console.log(e);
    // console.log(JSON.stringify(e));
    console.log(e.relatedTarget);
  }

  static async addNodeToSection(e: L.ContextMenuItemClickEvent) {
    await this.addToSection(e, EquipmentType.EmptyNode);
  }

  static async addPointToSection(e: L.ContextMenuItemClickEvent) {
    await this.addToSection(e, EquipmentType.AdjustmentPoint);
  }

  static async addToSection(e: L.ContextMenuItemClickEvent, eqType: EquipmentType) {
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
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'AddNodeIntoFiber'));
    if (response.success) {
      // добавить этот узел на карту и в GeoData
      const traceNode = new TraceNode(command.Id, '', e.latlng, eqType);
      MapLayersActions.addNodeToLayer(traceNode);
      this.gisMapService.getGeoData().nodes.push(traceNode);

      // добавить 2 новых волокна на карту и в GeoData
      const newFiber1 = new GeoFiber(
        command.NewFiberId1,
        oldFiber.node1id,
        oldFiber.coors1,
        command.Id,
        e.latlng,
        oldFiber.fiberState
      );
      const newFiber2 = new GeoFiber(
        command.NewFiberId2,
        command.Id,
        e.latlng,
        oldFiber.node2id,
        oldFiber.coors2,
        oldFiber.fiberState
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
    }
  }

  static async removeSection(e: L.ContextMenuItemClickEvent) {
    const fiberId = (<any>e.relatedTarget).id;
    const oldFiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;

    const command = {
      FiberId: fiberId
    };
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'RemoveFiber'));
    if (response.success) {
      // если один из концов волокна - точка привязки, то удаляем её и продолжение после неё и т.д.

      // удалить волокно с карты и из GeoData
      const routeGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
      const oldRouteLayer = routeGroup.getLayers().find((r) => (<any>r).id === fiberId);
      routeGroup.removeLayer(oldRouteLayer!);
      const indexOfFiber = this.gisMapService.getGeoData().fibers.indexOf(oldFiber);
      if (indexOfFiber > -1) {
        this.gisMapService.getGeoData().fibers.splice(indexOfFiber, 1);
      }
    }
  }
}
