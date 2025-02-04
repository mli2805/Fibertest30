import * as L from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType, UserSettings } from 'src/grpc-generated';
import { GisMapService } from '../../gis-map.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { Injector } from '@angular/core';
import { MapLayersActions } from './map-layers-actions';
import { MapMouseActions } from './map-mouse-actions';

export class MapActions {
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
  }

  static initMap(userSettings: UserSettings): void {
    this.gisMapService.setShowNodesFromZoom(userSettings.showNodesFromZoom);
    this.gisMapService.currentZoom.next(userSettings.zoom);
    const map = L.map('map', {
      center: [userSettings.lat, userSettings.lng],
      zoom: userSettings.zoom,
      contextmenu: true,
      contextmenuItems: []
    });

    map.on('zoomend', (e) => {
      MapMouseActions.onZoom();
    });

    map.on('click', (e) => {
      MapMouseActions.onClick(e.latlng);
    });

    map.on('mousemove', (e) => {
      MapMouseActions.onMouseMove(e.latlng);
    });

    map.on('dragend', (e) => {
      MapMouseActions.onDragEnd();
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 21,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
    }).addTo(map);

    // hide leaflet own attribution
    map.attributionControl.setPrefix('');
    this.gisMapService.setMap(map);
    MapLayersActions.initMapLayersMap();
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
    console.log(command);
    const json = JSON.stringify(command);
    const response = await firstValueFrom(
      this.graphService.sendCommand(json, 'AddEquipmentAtGpsLocation')
    );
    if (response.success) {
      // добавить этот узел на карту и в GeoData
      const traceNode = new TraceNode(command.NodeId, '', e.latlng, equipmentType);
      MapLayersActions.addNodeToLayer(traceNode);
      this.gisMapService.getGeoData().nodes.push(traceNode);
    }
  }

  static copyCoordinates(e: L.ContextMenuItemClickEvent) {
    console.log(`copyCoordinates clicked ${e.latlng}`);
  }

  static measureDistance(e: L.ContextMenuItemClickEvent) {
    console.log(`measureDistance clicked ${e.latlng}`);
  }
}
