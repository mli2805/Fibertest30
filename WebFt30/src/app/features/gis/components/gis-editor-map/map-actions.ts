import * as L from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapService } from '../../gis-map.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GisIconWithZIndex, GisMapIcons } from '../shared/gis-map-icons';
import { GisMapLayer } from '../../models/gis-map-layer';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { MapFiberMenu } from './map-fiber-menu';
import { Injector } from '@angular/core';
import { MapNodeMenu } from './map-node-menu';

export class MapActions {
  private static icons = new GisMapIcons();
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
  }

  static emptyGuid = '00000000-0000-0000-0000-000000000000';
  static async addNewNode(e: L.ContextMenuItemClickEvent, equipmentType: EquipmentType) {
    const guid =
      equipmentType === EquipmentType.EmptyNode || equipmentType === EquipmentType.AdjustmentPoint
        ? this.emptyGuid
        : crypto.randomUUID();
    const command = {
      RequestedEquipmentId: crypto.randomUUID(),
      EmptyNodeEquipmentId: guid,
      NodeId: crypto.randomUUID(),
      Type: equipmentType,
      Latitude: e.latlng.lat,
      Longitude: e.latlng.lng
    };
    console.log(command);
    const json = JSON.stringify(command);
    const response = await firstValueFrom(
      this.graphService.sendCommand(json, 'AddEquipmentAtGpsLocation')
    );
    if (response.success) {
      const traceNode = new TraceNode(command.NodeId, '', e.latlng, equipmentType);
      this.addNodeToLayer(traceNode);
    }
  }

  static addNodeToLayer(node: TraceNode): void {
    const marker = this.createMarker(node.coors, node.equipmentType, this.icons.getIcon(node));
    marker.bindPopup(node.title);
    (<any>marker).id = node.id;

    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    const group = this.gisMapService.getLayerGroups().get(layerType)!;
    group.addLayer(marker);
  }

  static addFiberToLayer(fiber: GeoFiber): void {
    const options = {
      color: ColorUtils.routeStateToColor(fiber.fiberState),
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: MapFiberMenu.buildFiberContextMenu()
    };
    const polyline = L.polyline([fiber.coors1, fiber.coors2], options);
    (<any>polyline).id = fiber.id;

    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    group.addLayer(polyline);
  }

  static createMarker(
    coordinate: L.LatLng,
    equipmentType: EquipmentType,
    iconWithIndex: GisIconWithZIndex
  ): L.Marker {
    const options = {
      icon: iconWithIndex.icon,
      draggable: true,
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: MapNodeMenu.buildMarkerContextMenu(equipmentType)
    };
    const marker = L.marker(coordinate, options);

    if (iconWithIndex?.zIndex) {
      marker.setZIndexOffset(iconWithIndex.zIndex * 1000);
    }

    marker.on('click', () => {
      console.log((<any>marker).id);
    });

    marker.on('dragend', (e) => {
      this.dragMarkerWithPolylines(e);
    });

    return marker;
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

      this.addFiberToLayer(f);
    });
  }

  static copyCoordinates(e: L.ContextMenuItemClickEvent) {
    console.log(`copyCoordinates clicked ${e.latlng}`);
  }

  static measureDistance(e: L.ContextMenuItemClickEvent) {
    console.log(`measureDistance clicked ${e.latlng}`);
  }
}
