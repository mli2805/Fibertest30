import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  OnDestroy,
  OnInit
} from '@angular/core';
import { GisMapUtils } from './gis-map.utils';
import { GisMapLayer } from '../../models/gis-map-layer';
import { GisIconWithZIndex, GisMapIcons } from './gis-map-icons';
import { LeafletAngularPopupBinder } from './leaflet-angular-popup-binder';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  GraphRoutesData,
  TraceNode,
  TraceRouteData
} from 'src/app/core/store/models/ft30/graph-data';
import { GeoCoordinate } from 'src/grpc-generated';

GisMapUtils.fixLeafletMarkers();

@Component({
  selector: 'rtu-gis-map',
  templateUrl: './gis-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  static RouteColor = '#1d4ed8';
  static ZoomNoClustering = 16;

  private map!: L.Map;
  private icons = new GisMapIcons();
  private mapLayersMap: Map<GisMapLayer, L.FeatureGroup | L.LayerGroup> = new Map();
  private previousLocateRoutePart: L.Polyline | null = null;

  private popupBinder!: LeafletAngularPopupBinder;

  startZoom = 11;
  currentZoom = new BehaviorSubject<number>(this.startZoom);
  currentZoom$ = this.currentZoom.asObservable();

  mousePosition = new BehaviorSubject<string>('');
  mousePosition$ = this.mousePosition.asObservable();

  constructor(
    private gisMapService: GisMapService,
    appRef: ApplicationRef,
    envInjector: EnvironmentInjector
  ) {
    super();

    this.popupBinder = new LeafletAngularPopupBinder(appRef, envInjector);
  }

  ngOnInit(): void {
    this.initMap();

    this.gisMapService.traceRouteData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((x) => this.onTraceRouteData(x));

    this.gisMapService.graphRoutesData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onGraphRoutesData(d));
  }

  override ngOnDestroy(): void {
    this.popupBinder?.destroy();

    super.ngOnDestroy();
  }

  private minskCoors: L.LatLngExpression = [53.85, 27.59];
  private minskZoom = 11;
  private mogilevCoors: L.LatLngExpression = [53.85, 29.99];
  private mogilevZoom = 9;

  private initMap(): void {
    this.startZoom = this.mogilevZoom;
    this.map = L.map('map', {
      center: this.mogilevCoors,
      zoom: this.startZoom
    });

    this.map.on('zoomend', (e) => {
      this.currentZoom.next(this.map.getZoom());
    });

    this.map.on('click', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(this.mncToString(e.latlng, center));
    });

    this.map.on('mousemove', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(this.mncToString(e.latlng, center));
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
    }).addTo(this.map);

    // hide leaflet own attribution
    this.map.attributionControl.setPrefix('');

    this.initMapLayersMap();
  }

  latLngToString(latlng: L.LatLng): string {
    const lat = Math.round(latlng.lat * 1000000) / 1000000;
    const lng = Math.round(latlng.lng * 1000000) / 1000000;
    return `${lat} : ${lng}`;
  }

  mncToString(mouse: L.LatLng, center: L.LatLng): string {
    return `center: ${this.latLngToString(center)},  mouse: ${this.latLngToString(mouse)}`;
  }

  private initMapLayersMap(): void {
    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const layer = this.getLayerGroupByGisType(layerType);
      this.mapLayersMap.set(layerType, layer);
    }

    // set initial visibility
    GisMapService.InitialLayerVisibility.forEach((value, key) => {
      this.setLayerVisibility(key, value);
    });
  }

  private getLayerGroupByGisType(layerType: GisMapLayer): L.LayerGroup | L.FeatureGroup {
    // route needs to be a feature group to use getBounds()
    if (layerType === GisMapLayer.Route) {
      return L.featureGroup();
    } else {
      // return L.layerGroup();

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      return L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
          return GisMapIcons.createLetterIcon(
            cluster.getChildCount().toString(),
            false,
            GisMapIcons.getColorClass(layerType),
            true
          );
          // return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
        },
        disableClusteringAtZoom: GisMapComponent.ZoomNoClustering,
        maxClusterRadius: 120,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: false
      });
    }
  }

  private layer(layerType: GisMapLayer): L.FeatureGroup | L.LayerGroup {
    return this.mapLayersMap.get(layerType)!;
  }

  private setLayerVisibility(layerType: GisMapLayer, visible: boolean) {
    if (!this.map) {
      return;
    }

    const layer = this.layer(layerType);

    if (!visible && this.map.hasLayer(layer)) {
      this.map.removeLayer(layer);
    }

    if (visible && !this.map.hasLayer(layer)) {
      this.map.addLayer(layer);
    }
  }

  onTraceRouteData(data: { traceRouteData: TraceRouteData } | null): void {
    this.mapLayersMap.forEach((layer) => layer.clearLayers());
    if (!data) return;
    this.addTraceRoute(data.traceRouteData);
  }

  onGraphRoutesData(data: { graphRoutesData: GraphRoutesData } | null): void {
    this.mapLayersMap.forEach((layer) => layer.clearLayers());
    if (!data) return;
    this.addGraphRoutes(data.graphRoutesData.routes);
  }

  private addGraphRoutes(routes: TraceRouteData[]): void {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const latLngs = route.nodes.map((n) => new L.LatLng(n.coors.latitude, n.coors.longitude));
      L.polyline(latLngs, { color: GisMapComponent.RouteColor }).addTo(
        this.layer(GisMapLayer.Route)
      );
    }
  }

  private addTraceRoute(route: TraceRouteData): void {
    const latLngs = route.nodes.map((n) => new L.LatLng(n.coors.latitude, n.coors.longitude));
    L.polyline(latLngs, { color: GisMapComponent.RouteColor }).addTo(this.layer(GisMapLayer.Route));

    route.nodes.forEach((node) => {
      this.addNodeToLayer(GisMapLayer.Locations, node);
    });

    const bounds = new L.LatLngBounds(latLngs);
    this.map.fitBounds(bounds);
  }

  private addNodeToLayer(layerType: GisMapLayer, node: TraceNode): void {
    const marker = this.createMarker(node.coors, this.icons.location);
    marker.bindPopup(node.title);
    (<any>marker).id = node.id;
    this.layer(layerType).addLayer(marker);
  }

  createMarker(coordinate: GeoCoordinate, iconWithIndex?: GisIconWithZIndex): L.Marker {
    const options = iconWithIndex?.icon ? { icon: iconWithIndex.icon } : {};
    const marker = L.marker([coordinate.latitude, coordinate.longitude], options);

    if (iconWithIndex?.zIndex) {
      marker.setZIndexOffset(iconWithIndex.zIndex * 1000);
    }

    marker.on('click', () => {
      console.log("I'm clicked");
    });

    return marker;
  }
}
