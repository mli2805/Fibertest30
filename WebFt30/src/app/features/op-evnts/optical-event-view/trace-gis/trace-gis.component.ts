import * as L from 'leaflet';
import { Component, inject, Input, OnInit } from '@angular/core';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsSelectors } from 'src/app/core';
import { GisMapLayer } from 'src/app/features/gis/components/shared/gis-map-layer';
import { GisMapUtils } from 'src/app/features/gis/components/shared/gis-map.utils';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { TraceNode, TraceRouteData } from 'src/app/core/store/models/ft30/geo-data';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { MapLayersActions } from 'src/app/features/gis/components/gis-actions/map-layers-actions';
import { GisMapIcons } from 'src/app/features/gis/components/shared/gis-map-icons';

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
  private icons = new GisMapIcons();
  private map!: L.Map;
  private layerGroups = new Map();

  constructor(private gisMapService: GisMapService) {}

  ngOnInit(): void {
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);

    const traceId = this._optivalEvent.traceId;
    const geoTrace = this.gisMapService.getGeoData().traces.find((t) => t.id === traceId)!;
    const nodes = geoTrace.nodeIds.map((n) => {
      return this.gisMapService.getNode(n);
    });
    const route = new TraceRouteData(traceId, nodes, geoTrace.state);

    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 7,
      contextmenu: false,
      contextmenuItems: []
    });

    switch (userSettings.sourceMapId) {
      case 0: {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    }

    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const group = GisMapUtils.createLayerGroupByGisType(layerType);
      this.layerGroups.set(layerType, group);
      this.map.addLayer(group);
    }

    this.addTraceRoute(route, true);
  }

  addTraceRoute(route: TraceRouteData, toBounds: boolean): void {
    const latLngs = route.nodes.map((n) => n.coors);
    const polyline = L.polyline(latLngs, { color: ColorUtils.routeStateToColor(route.traceState) });
    const group = this.layerGroups.get(GisMapLayer.Route)!;
    group.addLayer(polyline);

    route.nodes.forEach((node) => {
      this.addNodeToLayer(node);
    });

    if (toBounds) {
      const bounds = new L.LatLngBounds(latLngs);
      this.map.fitBounds(bounds);
    }
  }

  addNodeToLayer(node: TraceNode): L.Marker {
    const marker = MapLayersActions.createMarker(
      node.coors,
      node.equipmentType,
      this.icons.getIcon(node),
      node.id,
      node.title
    );
    (<any>marker).id = node.id;

    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    const group = this.layerGroups.get(layerType)!;
    group.addLayer(marker);
    return marker;
  }
}
