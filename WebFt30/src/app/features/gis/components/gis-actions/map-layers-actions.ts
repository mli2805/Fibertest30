import * as L from 'leaflet';
import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { GisIconWithZIndex, GisMapIcons } from '../shared/gis-map-icons';
import {
  FiberStateItem,
  GeoFiber,
  TraceNode,
  TraceRouteData
} from 'src/app/core/store/models/ft30/geo-data';
import { GisMapUtils } from '../shared/gis-map.utils';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { MapFiberMenu } from './map-fiber-menu';
import { GisMapLayer } from '../shared/gis-map-layer';
import { EquipmentType } from 'src/grpc-generated/gis';
import { MapNodeMenu } from './map-node-menu';
import { GisMapLayers } from '../shared/gis-map-layers';
import { MapMouseActions } from './map-mouse-actions';
import { UserSettings } from 'src/app/core/models/user-settings';
import { MapMenu } from './map-menu';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

import { environment } from 'src/environments/environment';

export class MapLayersActions {
  private static icons = new GisMapIcons();
  private static gisMapService: GisMapService;
  private static hasEditPermissions: boolean;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
  }

  static initMap(userSettings: UserSettings, hasEditPermissions: boolean): void {
    this.hasEditPermissions = hasEditPermissions;
    const map = L.map('map', {
      center: [userSettings.lat, userSettings.lng],
      zoom: userSettings.zoom,
      contextmenu: true,
      contextmenuItems: MapMenu.buildMapMenu(hasEditPermissions),
      zoomControl: false
    });

    map.on('zoomend', (e) => {
      MapMouseActions.onZoom(e);
    });

    map.on('click', (e) => {
      MapMouseActions.onClick();
    });

    map.on('mousemove', (e) => {
      MapMouseActions.onMouseMove(e);
    });

    map.on('mousedown', (e) => {
      document.getElementById('map')!.style.cursor = 'move';
    });

    map.on('mouseup', (e) => {
      document.getElementById('map')!.style.cursor = 'default';
    });

    map.on('dragend', (e) => {
      MapMouseActions.onDragEnd();
    });

    // не реагирует почему-то
    // map.on('keydown', (e) => {
    //   console.log(e);
    //   if (e.originalEvent.code === 'Escape') {
    //     if (this.gisMapService.addSectionMode) {
    //       this.gisMapService.addSectionMode = false;
    //       if (MapMouseActions.lineInProgress !== undefined) {
    //         this.gisMapService.getMap().removeLayer(MapMouseActions.lineInProgress);
    //       }
    //     }
    //   }
    // });

    this.setTileLayer(userSettings.sourceMapId, map);

    // hide leaflet own attribution
    map.attributionControl.setPrefix('');
    this.gisMapService.setMap(map);
    this.initMapLayersMap();

    document.getElementById('map')!.style.cursor = 'default';
  }

  static tileLayer: any = null;
  // https://stackoverflow.com/questions/33343881/leaflet-in-google-maps
  static setTileLayer(mapId: number, map: L.Map) {
    if (this.tileLayer !== null) map.removeLayer(this.tileLayer);

    switch (mapId) {
      case 0: {
        this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
        }).addTo(map);
        break;
      }
      case 1: {
        this.tileLayer = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);
        break;
      }
      case 2: {
        this.tileLayer = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);
        break;
      }
      case 3: {
        const api = <any>environment.api;
        const host = api.host || window.location.hostname;

        const httpAddress = 'http://localhost:5289/gis/{x}/{y}/{z}';
        const httpsAddress = 'https://localhost:7151/gis/{x}/{y}/{z}';

        const ccc = `https://${host}/gis/{x}/{y}/{z}`;

        console.log(ccc);
        this.tileLayer = L.tileLayer(ccc, {
          minZoom: 8,
          maxZoom: 17
        }).addTo(map);
        break;
      }
      // case 4: {
      //   this.tileLayer = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}', {
      //     maxZoom: 20,
      //     subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      //   }).addTo(map);
      //   break;
      // }
    }
  }

  static initMapLayersMap(): void {
    const layerGroups = new Map();
    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const group = GisMapUtils.createLayerGroupByGisType(layerType);

      layerGroups.set(layerType, group);

      this.gisMapService.getMap().addLayer(group);
    }
    this.gisMapService.setLayerGroups(layerGroups);

    // если показывать не кластера а по зуму, то при инициализации
    // надо не просто добавить слой в карту
    // а сделать это в зависимомсти от текущего зума
    this.setLayersVisibility();
  }

  static setLayersVisibility() {
    GisMapService.GisMapLayerZoom.forEach((value, key) => {
      GisMapLayers.setLayerVisibility(
        this.gisMapService.getMap(),
        this.gisMapService.getLayerGroups(),
        key,
        this.gisMapService.currentZoom.value >= value
      );
    });
  }

  static addTraceRoute(route: TraceRouteData, toBounds: boolean): void {
    const latLngs = route.nodes.map((n) => n.coors);
    const polyline = L.polyline(latLngs, { color: ColorUtils.routeStateToColor(route.traceState) });
    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    group.addLayer(polyline);

    route.nodes.forEach((node) => {
      MapLayersActions.addNodeToLayer(node);
    });

    if (toBounds) {
      const bounds = new L.LatLngBounds(latLngs);
      this.gisMapService.getMap().fitBounds(bounds);
    }
  }

  static addNodeToLayer(node: TraceNode): L.Marker {
    const marker = this.createMarker(
      node.coors,
      node.equipmentType,
      this.icons.getIcon(node),
      node.id,
      node.title
    );
    (<any>marker).id = node.id;

    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    const group = this.gisMapService.getLayerGroups().get(layerType)!;
    group.addLayer(marker);
    return marker;
  }

  static addFiberToLayer(fiber: GeoFiber): L.Polyline {
    const polyline = this.createMyLine(fiber);
    (<any>polyline).id = fiber.id;

    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    group.addLayer(polyline);
    return polyline;
  }

  static createMyLine(fiber: GeoFiber) {
    const options = {
      color: ColorUtils.routeStateToColor(fiber.getState()),
      weight: 3,
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: MapFiberMenu.buildFiberContextMenu(this.hasEditPermissions)
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
    iconWithIndex: GisIconWithZIndex,
    nodeId: string,
    nodeTitle: string
  ): L.Marker {
    const options = {
      icon: iconWithIndex.icon,
      draggable: false,
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: MapNodeMenu.buildMarkerContextMenu(equipmentType, this.hasEditPermissions)
    };
    const marker = L.marker(coordinate, options);

    if (iconWithIndex?.zIndex) {
      marker.setZIndexOffset(iconWithIndex.zIndex * 1000);
    }

    let popup: any = null;
    // надо сдвигать popup потому что если мышь оказывается над popup'ом то он пропадает
    const popupShift = equipmentType === EquipmentType.Rtu ? -40 : -4;
    marker.on('mouseover', (e) => {
      if (nodeTitle === '') return;
      popup = L.popup({ offset: L.point(popupShift, popupShift) });
      popup.setContent(nodeTitle);
      popup.setLatLng(e.target.getLatLng());
      popup.openOn(this.gisMapService.getMap());
    });

    marker.on('mouseout', (e) => {
      this.gisMapService.getMap().closePopup(popup);
    });

    if (!this.hasEditPermissions) return marker;
    // остальные обработчики нужны только руту

    marker.on('click', (e) => {
      // завершить создание нового участка
      if (this.gisMapService.addSectionMode) {
        if (MapMouseActions.lineInProgress !== undefined) {
          this.gisMapService.getMap().removeLayer(MapMouseActions.lineInProgress);
        }
        MapNodeMenu.addNewFiber((<any>marker).id);
      }
    });

    marker.on('mousedown', (e) => {
      MapMouseActions.onMouseDownOnNode(e, nodeId);
      L.DomEvent.stopPropagation(e);
    });

    marker.on('mouseup', (e) => {
      MapMouseActions.onMouseUpOnNode(e, nodeId);
      L.DomEvent.stopPropagation(e);
    });

    return marker;
  }

  static changeHighlight(nodeId: string | null) {
    // погасить старый если был
    if (this.gisMapService.previousHighlightNode !== null) {
      this.concealNode(this.gisMapService.previousHighlightNode);
    }
    // подсветить новый если не null
    if (nodeId !== null) {
      this.highlightNode(nodeId);
    }
  }

  static concealNode(nodeId: string) {
    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Highlight)!;
    const marker = group.getLayers().find((m) => (<any>m).id === nodeId);
    group.removeLayer(marker!);
  }

  static highlightNode(nodeId: string) {
    const node = this.gisMapService.getNode(nodeId);
    const highlightIcon =
      node.equipmentType === EquipmentType.Rtu ? this.icons.highlightRtu : this.icons.highlightNode;

    const options = {
      icon: highlightIcon.icon,
      contextmenu: false,
      contextmenuItems: []
    };
    const marker = L.marker(node!.coors, options);
    (<any>marker).id = node.id;
    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Highlight)!;
    group.addLayer(marker);

    this.gisMapService.getMap().setView(node.coors);
  }

  // использовать только при определении трассы:
  // добавляет state с emptyGuid
  static highlightStepThroughFiber(fiber: GeoFiber) {
    fiber.states.push(new FiberStateItem(GisMapUtils.emptyGuid, FiberState.HighLighted));
    this.reDrawFiber(fiber);
  }

  // использовать только при определении трассы:
  // трасса может проходить по волокну несколько раз
  // поэтому надо убрать один, последний проход
  static extinguishLastStepThroughFiber(fiber: GeoFiber) {
    for (let i = fiber.states.length - 1; i >= 0; i--) {
      if (fiber.states[i].traceState === FiberState.HighLighted) {
        fiber.states.splice(i, 1);
        break;
      }
    }
    this.reDrawFiber(fiber);
  }

  // использовать только после определения трассы:
  // гасит всё убирая все записи с FiberState.HighLighted и emptyGuid
  static extinguishAllFibers() {
    this.gisMapService.getGeoData().fibers.forEach((f) => {
      const l = f.states.length;
      f.states = f.states.filter(
        (s) => s.traceState !== FiberState.HighLighted || s.traceId !== GisMapUtils.emptyGuid
      );
      if (l !== f.states.length) {
        this.reDrawFiber(f);
      }
    });
  }

  // изменить цвет существующей трассы РеальноеСостояние / Подсветка
  static drawTraceWith(traceId: string, state: FiberState) {
    const trace = this.gisMapService.getGeoData().traces.find((t) => t.id === traceId);
    if (trace === undefined) return;

    trace.fiberIds.forEach((i) => {
      const fiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === i);
      if (fiber === undefined) return;

      // трасса может проходить по волокну несколько раз
      fiber.states
        .filter((s) => s.traceId === traceId)
        .forEach((s) => {
          s.traceState = state;
        });
      this.reDrawFiber(fiber);
    });
  }

  // перерисовать волокно
  // удалит из leaflet старую отрисовку участка и нарисует по новой
  static reDrawFiber(fiber: GeoFiber) {
    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    const polyline = group.getLayers().find((f) => (<any>f).id === fiber.id);
    group.removeLayer(polyline!);
    this.addFiberToLayer(fiber);
  }
}
