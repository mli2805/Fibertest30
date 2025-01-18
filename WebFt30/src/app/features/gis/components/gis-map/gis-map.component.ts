import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  inject,
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
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { TranslateService } from '@ngx-translate/core';
import { GisMapIcons, GisIconWithZIndex } from '../shared/gis-map-icons';
import { GisMapUtils } from '../shared/gis-map.utils';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';
import { Store } from '@ngrx/store';
import { AppState, SettingsActions, SettingsSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';

GisMapUtils.fixLeafletMarkers();

@Component({
  selector: 'rtu-gis-map',
  templateUrl: './gis-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  private store: Store<AppState> = inject(Store<AppState>);
  static ZoomNoClustering = 18; // прячем слои вместо кластеризации

  private map!: L.Map;
  private icons = new GisMapIcons();
  private layerGroups: Map<GisMapLayer, L.FeatureGroup> = new Map();

  private popupBinder!: LeafletAngularPopupBinder;

  currentZoom = new BehaviorSubject<number>(16);
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

  private initMap(): void {
    // когда показываем трассу центр и зум выбираются позже исходя из точек трассы (чтобы вся видна была)
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
    this.currentZoom.next(userSettings.zoom);
    this.map = L.map('map', {
      center: [userSettings.lat, userSettings.lng],
      zoom: userSettings.zoom,
      contextmenu: true,
      contextmenuItems: []
    });

    this.map.on('zoomend', (e) => {
      const newZoom = this.map.getZoom();
      // this.adjustLayersToZoom(newZoom);
      this.currentZoom.next(newZoom);
      this.store.dispatch(SettingsActions.changeZoom({ zoom: newZoom }));
    });

    this.map.on('click', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(GisMapUtils.mouseToString(e.latlng, center));
    });

    this.map.on('mousemove', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(GisMapUtils.mouseToString(e.latlng, center));
    });

    this.map.on('dragend', (e) => {
      const center = this.map.getCenter();
      this.store.dispatch(SettingsActions.changeCenter({ center }));
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
    }).addTo(this.map);

    // hide leaflet own attribution
    this.map.attributionControl.setPrefix('');

    this.initMapLayersMap();
  }

  private initMapLayersMap(): void {
    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const group = GisMapUtils.createLayerGroupByGisType(layerType);
      this.layerGroups.set(layerType, group);

      this.map.addLayer(group);
    }

    // если показывать не кластера а по зуму, то при инициализации
    // надо не просто добавить слой в карту (выше строка)
    // а сделать это в зависимомсти от текущего зума
    // GisMapService.GisMapLayerZoom.forEach((value, key) => {
    //   GisMapLayers.setLayerVisibility(
    //     this.map,
    //     this.layerGroups,
    //     key,
    //     this.currentZoom.value >= value
    //   );
    // });
  }

  onTraceRouteData(data: { traceRouteData: TraceRouteData } | null): void {
    this.layerGroups.forEach((group) => group.clearLayers());
    if (!data) return;
    this.addTraceRoute(data.traceRouteData);
  }

  onGraphRoutesData(data: { graphRoutesData: GraphRoutesData } | null): void {
    this.layerGroups.forEach((group) => group.clearLayers());
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
      const group = this.layerGroups.get(GisMapLayer.Route)!;
      group.addLayer(polyline);

      route.nodes.forEach((node) => {
        this.addNodeToLayer(node);
      });
    }
  }

  private addTraceRoute(route: TraceRouteData): void {
    const latLngs = route.nodes.map((n) => n.coors);
    const polyline = L.polyline(latLngs, { color: ColorUtils.routeStateToColor(route.traceState) });
    const group = this.layerGroups.get(GisMapLayer.Route)!;
    group.addLayer(polyline);

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

    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    const group = this.layerGroups.get(layerType)!;
    group.addLayer(marker);
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
