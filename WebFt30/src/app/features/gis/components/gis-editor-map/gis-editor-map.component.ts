import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-contextmenu';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  inject,
  Injector,
  OnDestroy,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom, takeUntil } from 'rxjs';
import { GisIconWithZIndex, GisMapIcons } from '../shared/gis-map-icons';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { EquipmentType } from 'src/grpc-generated';
import { AllGeoData, GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GisMapService } from '../../gis-map.service';
import { GisMapLayer } from '../../models/gis-map-layer';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsActions, SettingsSelectors } from 'src/app/core';
import { GraphService } from 'src/app/core/grpc';
import { MapNodeMenu } from './map-node-menu';
import { MapFiberMenu } from './map-fiber-menu';
import { MapActions } from './map-actions';
import { MapMenu } from './map-menu';

@Component({
  selector: 'rtu-gis-editor-map',
  templateUrl: './gis-editor-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisEditorMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  private store: Store<AppState> = inject(Store<AppState>);
  private map!: L.Map;
  private icons = new GisMapIcons();

  private popupBinder!: LeafletAngularPopupBinder;

  currentZoom = new BehaviorSubject<number>(16);
  currentZoom$ = this.currentZoom.asObservable();

  mousePosition = new BehaviorSubject<string>('');
  mousePosition$ = this.mousePosition.asObservable();

  constructor(
    private injector: Injector,
    private gisMapService: GisMapService,
    appRef: ApplicationRef,
    envInjector: EnvironmentInjector
  ) {
    super();
    MapMenu.initialize(injector);
    MapActions.initialize(injector);
    MapNodeMenu.initialize(injector);
    MapFiberMenu.initialize(injector);
    this.popupBinder = new LeafletAngularPopupBinder(appRef, envInjector);
  }

  ngOnInit(): void {
    this.initMap();

    this.gisMapService.geoData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onGeoData(d));
  }

  override ngOnDestroy(): void {
    this.popupBinder?.destroy();

    super.ngOnDestroy();
  }

  private initMap(): void {
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
    this.currentZoom.next(userSettings.zoom);
    this.map = L.map('map', {
      center: [userSettings.lat, userSettings.lng],
      zoom: userSettings.zoom,
      contextmenu: true,
      contextmenuItems: MapMenu.buildMapMenu()
    });

    this.map.on('zoomend', (e) => {
      const newZoom = this.map.getZoom();
      // GisMapLayers.adjustLayersToZoom(this.map, this.layerGroups, this.currentZoom.value, newZoom);
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

    this.gisMapService.setMap(this.map);
    this.initMapLayersMap();
  }

  private initMapLayersMap(): void {
    const layerGroups = new Map();
    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const group = GisMapUtils.createLayerGroupByGisType(layerType);

      layerGroups.set(layerType, group);

      this.map.addLayer(group);
    }
    this.gisMapService.setLayerGroups(layerGroups);

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

  geoData!: AllGeoData;
  onGeoData(data: { geoData: AllGeoData } | null): void {
    this.gisMapService.getLayerGroups().forEach((group) => group.clearLayers());

    if (!data) return;
    this.geoData = data.geoData;

    data.geoData.fibers.forEach((f) => MapActions.addFiberToLayer(f));
    data.geoData.nodes.forEach((n) => MapActions.addNodeToLayer(n));
  }
}
