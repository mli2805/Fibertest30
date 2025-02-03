import * as L from 'leaflet';
import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { GisIconWithZIndex, GisMapIcons } from '../shared/gis-map-icons';
import { GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapUtils } from '../shared/gis-map.utils';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { MapFiberMenu } from './map-fiber-menu';
import { GisMapLayer } from '../../models/gis-map-layer';
import { EquipmentType } from 'src/grpc-generated/gis';
import { MapNodeMenu } from './map-node-menu';

export class MapLayersActions {
  private static icons = new GisMapIcons();
  private static gisMapService: GisMapService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
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
    const polyline = this.createMyLine(fiber);
    (<any>polyline).id = fiber.id;

    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    group.addLayer(polyline);
  }

  static createMyLine(fiber: GeoFiber) {
    const options = {
      color: ColorUtils.routeStateToColor(fiber.fiberState),
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: MapFiberMenu.buildFiberContextMenu()
    };
    const line = L.polyline([fiber.coors1, fiber.coors2], options);
    line.on('contextmenu', (e) => {
      // чтобы не приходил этот же ивент от карты (портит ивент от линии)
      L.DomEvent.stopPropagation(e);
    });
    return line;
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

    marker.on('click', (e) => {
      if (this.gisMapService.addSectionMode) {
        MapNodeMenu.addNewFiber((<any>marker).id);
      }
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
}
