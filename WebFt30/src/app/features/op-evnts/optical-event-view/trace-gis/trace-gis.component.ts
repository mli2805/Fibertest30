import L from 'leaflet';
import { Component, inject, Input, OnInit } from '@angular/core';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsSelectors, SettingsState } from 'src/app/core';
import { GisMapLayer } from 'src/app/features/gis/components/shared/gis-map-layer';
import { GisMapUtils } from 'src/app/features/gis/components/shared/gis-map.utils';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import {
  GisIconWithZIndex,
  GisMapIcons
} from 'src/app/features/gis/components/shared/gis-map-icons';
import { EquipmentType } from 'src/grpc-generated';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FiberState, OpticalAccidentType } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
  selector: 'rtu-trace-gis',
  templateUrl: './trace-gis.component.html'
})
export class TraceGisComponent implements OnInit {
  private _optivalEvent!: OpticalEvent;
  @Input() set opticalEvent(value: OpticalEvent) {
    this._optivalEvent = value;
  }

  private store: Store<AppState> = inject(Store<AppState>);
  private userSettings!: SettingsState;
  private icons = new GisMapIcons();
  private map!: L.Map;
  private layerGroups = new Map();

  constructor(private gisMapService: GisMapService, private router: Router) {}

  ngOnInit(): void {
    const geoData = this.gisMapService.getGeoData();
    if (geoData === undefined) {
      this.router.navigate(['rtus/rtu-tree']);
      return;
    }

    this.userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);

    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 7,
      zoomSnap: 0.1,
      contextmenu: false,
      contextmenuItems: []
    });

    // настройка источника карты
    switch (this.userSettings.sourceMapId) {
      case 0: {
        const url =
          this.userSettings.theme === 'light'
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

        L.tileLayer(url, {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
        }).addTo(this.map);
        break;
      }
      case 1: {
        L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(this.map);
        break;
      }
      case 2: {
        L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(this.map);
        break;
      }
      case 3: {
        const api = <any>environment.api;
        const gisApiPort = api.gisApiPort;
        const host =
          gisApiPort !== undefined
            ? `localhost:${gisApiPort}`
            : api.host || window.location.hostname;
        const gisApiAddress = `https://${host}/gis/{x}/{y}/{z}`;
        L.tileLayer(gisApiAddress, {
          minZoom: 1,
          maxZoom: 21
        }).addTo(this.map);
        break;
      }
    }
    // hide leaflet own attribution
    this.map.attributionControl.setPrefix('');

    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const group = GisMapUtils.createLayerGroupByGisType(layerType);
      this.layerGroups.set(layerType, group);
      this.map.addLayer(group);
    }

    this.addTrace();
  }

  addTrace() {
    const traceId = this._optivalEvent.traceId;
    const trace = this.gisMapService.getGeoData().traces.find((t) => t.id === traceId)!;

    // этих аварий может уже не быть - добавляем маркеры для точечных аварий
    const accidentsOnTrace: TraceNode[] = [];

    this._optivalEvent.accidents.forEach((a) => {
      if (
        a.opticalTypeOfAccident === OpticalAccidentType.Break ||
        a.opticalTypeOfAccident === OpticalAccidentType.Loss ||
        a.opticalTypeOfAccident === OpticalAccidentType.Reflectace
      ) {
        accidentsOnTrace.push(
          new TraceNode(
            GisMapUtils.emptyGuid,
            '',
            a.accidentCoors,
            EquipmentType.AccidentPlace,
            '',
            a.accidentSeriousness,
            traceId
          )
        );
      }
    });

    const nodes = trace.nodeIds.map((n) => {
      return this.gisMapService.getNode(n);
    });

    [...nodes, ...accidentsOnTrace].forEach((node) => {
      this.addNodeToLayer(node);
    });

    const fibers = trace.fiberIds.map((i) => {
      return this.gisMapService.getGeoData().fibers.find((f) => f.id === i)!;
    });
    fibers.forEach((f) => this.addFiberToLayer(f!));

    const latLngs = nodes.map((n) => n.coors);
    const bounds = new L.LatLngBounds(latLngs);
    this.map.fitBounds(bounds, { padding: [40, 40] });
  }

  addFiberToLayer(fiber: GeoFiber): L.Polyline {
    const options = {
      // color: ColorUtils.routeStateToColor(fiber.getState()),
      // weight: fiber.tracesWithExceededLossCoeff.length > 0 ? 7 : 3,

      // договорились на форме состояния трассы показывать трассу всегда черным
      //  и не показывать толстым аварии по километрическому затуханию
      color: ColorUtils.routeStateToColor(FiberState.Ok),
      weight: 3,

      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: []
    };
    const polyline = L.polyline([fiber.coors1, fiber.coors2], options);
    (<any>polyline).id = fiber.id;

    const group = this.layerGroups.get(GisMapLayer.Route)!;
    group.addLayer(polyline);
    return polyline;
  }

  addNodeToLayer(node: TraceNode): L.Marker {
    const marker = this.createMarker(
      node.coors,
      node.equipmentType,
      this.icons.getIcon(node),
      node.title
    );
    (<any>marker).id = node.id;

    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    const group = this.layerGroups.get(layerType)!;
    group.addLayer(marker);
    return marker;
  }

  createMarker(
    coordinate: L.LatLng,
    equipmentType: EquipmentType,
    iconWithIndex: GisIconWithZIndex,
    nodeTitle: string
  ): L.Marker {
    const options = {
      icon: iconWithIndex.icon,
      draggable: false,
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: []
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
      popup.openOn(this.map);
    });

    marker.on('mouseout', (e) => {
      this.map.closePopup(popup);
    });

    return marker;
  }
}
