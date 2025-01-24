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
import { BehaviorSubject, takeUntil } from 'rxjs';
import { GisMapIcons } from '../shared/gis-map-icons';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { AllGeoData } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GisMapService } from '../../gis-map.service';
import { GisMapLayer } from '../../models/gis-map-layer';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsActions, SettingsSelectors } from 'src/app/core';
import { MapNodeMenu } from './map-node-menu';
import { MapFiberMenu } from './map-fiber-menu';
import { MapActions } from './map-actions';
import { MapMenu } from './map-menu';
import { MapLayersActions } from './map-layers-actions';
import { MapMouseActions } from './map-mouse-actions';

@Component({
  selector: 'rtu-gis-editor-map',
  templateUrl: './gis-editor-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisEditorMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  private store: Store<AppState> = inject(Store<AppState>);
  private map!: L.Map;

  private popupBinder!: LeafletAngularPopupBinder;

  constructor(
    private injector: Injector,
    public gisMapService: GisMapService,
    appRef: ApplicationRef,
    envInjector: EnvironmentInjector
  ) {
    super();
    MapMenu.initialize(injector);
    MapLayersActions.initialize(injector);
    MapMouseActions.initialize(injector);
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

    this.gisMapService.currentZoom$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onZoomChanged(d));
  }

  override ngOnDestroy(): void {
    this.popupBinder?.destroy();

    super.ngOnDestroy();
  }

  private initMap(): void {
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
    this.gisMapService.currentZoom.next(userSettings.zoom);
    this.map = L.map('map', {
      center: [userSettings.lat, userSettings.lng],
      zoom: userSettings.zoom,
      contextmenu: true,
      contextmenuItems: MapMenu.buildMapMenu()
    });

    this.map.on('zoomend', (e) => {
      MapMouseActions.onZoom();
    });

    this.map.on('click', (e) => {
      MapMouseActions.onClick(e.latlng);
    });

    this.map.on('mousemove', (e) => {
      MapMouseActions.onMouseMove(e.latlng);
    });

    this.map.on('dragend', (e) => {
      MapMouseActions.onDragEnd();
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

    data.geoData.fibers.forEach((f) => MapLayersActions.addFiberToLayer(f));
    data.geoData.nodes.forEach((n) => MapLayersActions.addNodeToLayer(n));
  }

  onZoomChanged(zoom: number) {
    //
  }
}
