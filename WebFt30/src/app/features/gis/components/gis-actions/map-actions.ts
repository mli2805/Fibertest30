import * as L from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { GeoEquipment, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapService } from '../../gis-map.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { Injector } from '@angular/core';
import { MapLayersActions } from './map-layers-actions';
import { GisMapLayer } from '../shared/gis-map-layer';

export class MapActions {
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
  }

  static async addNewNode(e: L.ContextMenuItemClickEvent, equipmentType: EquipmentType) {
    const guid =
      equipmentType === EquipmentType.EmptyNode || equipmentType === EquipmentType.AdjustmentPoint
        ? GisMapUtils.emptyGuid
        : crypto.randomUUID();
    const command = {
      RequestedEquipmentId: crypto.randomUUID(),
      EmptyNodeEquipmentId: guid,
      NodeId: crypto.randomUUID(),
      Type: equipmentType,
      Latitude: e.latlng.lat,
      Longitude: e.latlng.lng
    };
    const json = JSON.stringify(command);
    const response = await firstValueFrom(
      this.graphService.sendCommand(json, 'AddEquipmentAtGpsLocation')
    );
    if (response.success) {
      // добавить этот узел на карту и в GeoData
      const traceNode = new TraceNode(command.NodeId, '', e.latlng, equipmentType, '');
      MapLayersActions.addNodeToLayer(traceNode);
      this.gisMapService.getGeoData().nodes.push(traceNode);
      const geoEquipment = new GeoEquipment(
        command.RequestedEquipmentId,
        '',
        command.NodeId,
        command.Type,
        0,
        0,
        ''
      );
      this.gisMapService.getGeoData().equipments.push(geoEquipment);
    }
  }

  static dragMarkerWithPolylines(e: L.DragEndEvent) {
    const position = (<L.Marker>e.target).getLatLng();
    const nodeId = (<any>e.target).id;
    const node = this.gisMapService.getGeoData().nodes.find((n) => n.id === nodeId)!;
    node.coors = position;

    const fibers = this.gisMapService
      .getGeoData()
      .fibers.filter((f) => f.node1id === node.id || f.node2id === node.id);

    const routeGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    fibers.forEach((f) => {
      const oldRouteLayer = routeGroup.getLayers().find((r) => (<any>r).id === f.id);
      routeGroup.removeLayer(oldRouteLayer!);

      if (f.node1id === node.id) {
        f.coors1 = position;
      } else {
        f.coors2 = position;
      }

      MapLayersActions.addFiberToLayer(f);
    });
  }

  static copyCoordinates(e: L.ContextMenuItemClickEvent) {
    console.log(`copyCoordinates clicked ${e.latlng}`);
  }

  static measureDistance(e: L.ContextMenuItemClickEvent) {
    console.log(`measureDistance clicked ${e.latlng}`);
  }
}
