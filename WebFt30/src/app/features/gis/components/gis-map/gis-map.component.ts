import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  OnDestroy,
  OnInit
} from '@angular/core';
import { GisMapLayer } from '../../models/gis-map-layer';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  GraphRoutesData,
  TraceNode,
  TraceRouteData
} from 'src/app/core/store/models/ft30/geo-data';
import { GeoCoordinate } from 'src/grpc-generated';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { TranslateService } from '@ngx-translate/core';
import { GisMapIcons, GisIconWithZIndex } from '../shared/gis-map-icons';
import { GisMapUtils } from '../shared/gis-map.utils';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';

GisMapUtils.fixLeafletMarkers();

@Component({
  selector: 'rtu-gis-map',
  templateUrl: './gis-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  static ZoomNoClustering = 1; // прячем слои вместо кластеризации

  private map!: L.Map;
  private icons = new GisMapIcons();
  private mapLayersMap: Map<GisMapLayer, L.FeatureGroup | L.LayerGroup> = new Map();

  private popupBinder!: LeafletAngularPopupBinder;

  startZoom!: number;
  currentZoom = new BehaviorSubject<number>(this.startZoom);
  currentZoom$ = this.currentZoom.asObservable();

  mousePosition = new BehaviorSubject<string>('');
  mousePosition$ = this.mousePosition.asObservable();

  constructor(
    private gisMapService: GisMapService,
    private ts: TranslateService,
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
  private minskZoom = 14;
  private mogilevCoors: L.LatLngExpression = [53.85, 29.99];
  private mogilevZoom = 9;

  private initMap(): void {
    // когда показываем трассу центр и зум выбираются позже исходя из точек трассы (чтобы вся видна была)
    this.startZoom = this.minskZoom;
    this.currentZoom.next(this.startZoom);
    this.map = L.map('map', {
      center: this.minskCoors,
      zoom: this.startZoom,
      contextmenu: true,
      contextmenuItems: []
    });

    this.map.on('zoomend', (e) => {
      const newZoom = this.map.getZoom();
      this.adjustLayersToZoom(newZoom);
      this.currentZoom.next(newZoom);
    });

    this.map.on('click', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(GisMapUtils.mouseToString(e.latlng, center));
    });

    this.map.on('mousemove', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(GisMapUtils.mouseToString(e.latlng, center));
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
    }).addTo(this.map);

    // hide leaflet own attribution
    this.map.attributionControl.setPrefix('');

    this.initMapLayersMap();
  }

  adjustLayersToZoom(newZoom: number) {
    const emptyNodesZoom = GisMapService.GisMapLayerZoom.get(GisMapLayer.Locations)!;
    if (this.currentZoom.value < emptyNodesZoom && newZoom >= emptyNodesZoom) {
      this.setLayerVisibility(GisMapLayer.Locations, true);
    }
    if (this.currentZoom.value >= emptyNodesZoom && newZoom < emptyNodesZoom) {
      this.setLayerVisibility(GisMapLayer.Locations, false);
    }

    const equipmentZoom = GisMapService.GisMapLayerZoom.get(GisMapLayer.TraceEquipment)!;
    if (this.currentZoom.value < equipmentZoom && newZoom >= equipmentZoom) {
      this.setLayerVisibility(GisMapLayer.TraceEquipment, true);
    }
    if (this.currentZoom.value >= equipmentZoom && newZoom < equipmentZoom) {
      this.setLayerVisibility(GisMapLayer.TraceEquipment, false);
    }
  }

  private initMapLayersMap(): void {
    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const layer = this.getLayerGroupByGisType(layerType);
      this.mapLayersMap.set(layerType, layer);
    }

    GisMapService.GisMapLayerZoom.forEach((value, key) => {
      this.setLayerVisibility(key, this.currentZoom.value >= value);
    });
  }

  private getLayerGroupByGisType(layerType: GisMapLayer): L.LayerGroup | L.FeatureGroup {
    // route needs to be a feature group to use getBounds()
    if (layerType === GisMapLayer.Route) {
      return L.featureGroup();
    } else if (layerType === GisMapLayer.TraceEquipment) {
      return L.layerGroup();
    } else {
      return L.layerGroup();
      //   return L.markerClusterGroup({
      //     iconCreateFunction: function (cluster) {
      //       return GisMapIcons.createLetterIcon(
      //         cluster.getChildCount().toString(),
      //         false,
      //         GisMapIcons.getColorClass(layerType),
      //         true
      //       );
      //     },
      //     disableClusteringAtZoom: GisMapComponent.ZoomNoClustering,
      //     maxClusterRadius: 120,
      //     showCoverageOnHover: false,
      //     spiderfyOnMaxZoom: false
      //   });
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
      const latLngs = route.nodes.map((n) => n.coors);
      const options = {
        color: ColorUtils.routeStateToColor(route.traceState)
      };
      const polyline = L.polyline(latLngs, options);
      polyline.addTo(this.layer(GisMapLayer.Route));

      route.nodes.forEach((node) => {
        this.addNodeToLayer(node);
      });
    }
  }

  private addTraceRoute(route: TraceRouteData): void {
    const latLngs = route.nodes.map((n) => n.coors);
    L.polyline(latLngs, { color: ColorUtils.routeStateToColor(route.traceState) }).addTo(
      this.layer(GisMapLayer.Route)
    );

    route.nodes.forEach((node) => {
      this.addNodeToLayer(node);
    });

    const bounds = new L.LatLngBounds(latLngs);
    this.map.fitBounds(bounds);
  }

  private addNodeToLayer(node: TraceNode): void {
    const marker = this.createMarker(node.coors, this.icons.getIcon(node));
    marker.bindPopup(node.title);
    (<any>marker).id = node.id;

    const layer = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    this.layer(layer).addLayer(marker);
  }

  createMarker(coordinate: L.LatLng, iconWithIndex: GisIconWithZIndex): L.Marker {
    const options = {
      icon: iconWithIndex.icon,
      contextmenu: false,
      contextmenuItems: []
    };
    const marker = L.marker(coordinate, options);

    if (iconWithIndex?.zIndex) {
      marker.setZIndexOffset(iconWithIndex.zIndex * 1000);
    }

    marker.on('click', () => {
      console.log((<any>marker).id);
    });

    return marker;
  }
}
