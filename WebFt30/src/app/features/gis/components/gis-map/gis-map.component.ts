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
import 'leaflet-contextmenu';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  AllGeoData,
  GeoFiber,
  GraphRoutesData,
  TraceNode,
  TraceRouteData
} from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType, GeoCoordinate } from 'src/grpc-generated';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { TranslateService } from '@ngx-translate/core';

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
  private previousLocateRoutePart: L.Polyline | null = null;

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

    this.gisMapService.geoData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onGeoData(d));
  }

  override ngOnDestroy(): void {
    this.popupBinder?.destroy();

    super.ngOnDestroy();
  }

  private minskCoors: L.LatLngExpression = [53.85, 27.59];
  private minskZoom = 12;
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
      contextmenuItems: [
        {
          text: this.ts.instant('i18n.ft.add-node'),
          callback: (e) => this.addNewNode(e, EquipmentType.EmptyNode)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-cable-reserve'),
          callback: (e) => this.addNewNode(e, EquipmentType.CableReserve)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-closure'),
          callback: (e) => this.addNewNode(e, EquipmentType.Closure)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-cross'),
          callback: (e) => this.addNewNode(e, EquipmentType.Cross)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-terminal'),
          callback: (e) => this.addNewNode(e, EquipmentType.Terminal)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-other-equipment'),
          callback: (e) => this.addNewNode(e, EquipmentType.Other)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.add-rtu'),
          callback: (e) => this.addNewNode(e, EquipmentType.Rtu)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.copy-coordinates'),
          callback: (e) => this.copyCoordinates(e)
        },
        {
          text: this.ts.instant('i18n.ft.distance-measurement'),
          callback: (e) => this.copyCoordinates(e)
        }
      ]
    });

    this.map.on('zoomend', (e) => {
      const newZoom = this.map.getZoom();
      this.adjustLayersToZoom(newZoom);
      this.currentZoom.next(newZoom);
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

  onGeoData(data: { geoData: AllGeoData } | null): void {
    this.mapLayersMap.forEach((layer) => layer.clearLayers());
    if (!data) return;

    data.geoData.fibers.forEach((f) => this.addGeoFiber(f));
    data.geoData.nodes.forEach((n) => this.addNodeToLayer(n));
  }

  private addGeoFiber(fiber: GeoFiber): void {
    const c1 = new L.LatLng(fiber.coors1.latitude, fiber.coors1.longitude);
    const c2 = new L.LatLng(fiber.coors2.latitude, fiber.coors2.longitude);
    L.polyline([c1, c2], { color: ColorUtils.routeStateToColor(fiber.fiberState) }).addTo(
      this.layer(GisMapLayer.Route)
    );
  }

  private addGraphRoutes(routes: TraceRouteData[]): void {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const latLngs = route.nodes.map((n) => new L.LatLng(n.coors.latitude, n.coors.longitude));
      L.polyline(latLngs, { color: ColorUtils.routeStateToColor(route.traceState) }).addTo(
        this.layer(GisMapLayer.Route)
      );

      route.nodes.forEach((node) => {
        this.addNodeToLayer(node);
      });
    }
  }

  private addTraceRoute(route: TraceRouteData): void {
    const latLngs = route.nodes.map((n) => new L.LatLng(n.coors.latitude, n.coors.longitude));
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
    const marker = this.createMarker(node.coors, node.equipmentType, this.icons.getIcon(node));
    marker.bindPopup(node.title);
    (<any>marker).id = node.id;

    const layer = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    this.layer(layer).addLayer(marker);
  }

  createMarker(
    coordinate: GeoCoordinate,
    equipmentType: EquipmentType,
    iconWithIndex: GisIconWithZIndex
  ): L.Marker {
    const options = {
      icon: iconWithIndex.icon,
      draggable: true,
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: this.buildMarkerContextMenu(equipmentType)
    };
    const marker = L.marker([coordinate.latitude, coordinate.longitude], options);

    if (iconWithIndex?.zIndex) {
      marker.setZIndexOffset(iconWithIndex.zIndex * 1000);
    }

    marker.on('click', () => {
      console.log((<any>marker).id);
    });

    marker.on('dragend', (e) => {
      console.log(`new coordinates: ${(<L.Marker>e.target).getLatLng()}`);

      // двигает карту помещая новую позицию маркера в центр
      // удобно, если затягиваешь маркер за пределы экрана,
      // на сколько это удобно если двигаешь немного в пределах экрана
      // и не ожидаешь перемещения всей карты - это вопрос
      const position = (<L.Marker>e.target).getLatLng();
      this.map.panTo(position);
    });

    return marker;
  }

  buildMarkerContextMenu(equipmentType: EquipmentType): L.ContextMenuItem[] {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return this.buildRtuContextMenu();
      case EquipmentType.AdjustmentPoint:
        return this.buildAdjustmentPointContextMenu();
      default:
        return this.buildNodeContextMenu();
    }
  }

  buildRtuContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.define-trace'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      }
    ];
  }

  buildNodeContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-equipment'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addEquipment(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      }
    ];
  }

  buildAdjustmentPointContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.remove'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeNode(e)
      }
    ];
  }

  // map menu
  addNewNode(e: L.ContextMenuItemClickEvent, equipmentType: EquipmentType) {
    console.log(`addNewNode clicked ${e.latlng}, EquipmentType: ${equipmentType}`);
  }

  copyCoordinates(e: L.ContextMenuItemClickEvent) {
    console.log(`copyCoordinates clicked ${e.latlng}`);
  }

  measureDistance(e: L.ContextMenuItemClickEvent) {
    console.log(`measureDistance clicked ${e.latlng}`);
  }

  // node menu
  showInformation(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  addEquipment(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  removeNode(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  drawSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }
}
