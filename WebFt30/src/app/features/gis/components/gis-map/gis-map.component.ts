import 'leaflet.markercluster';
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
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { takeUntil } from 'rxjs';
import {
  AllGeoData,
  GraphRoutesData,
  TraceRouteData
} from 'src/app/core/store/models/ft30/geo-data';
import { TranslateService } from '@ngx-translate/core';
import { GisMapUtils } from '../shared/gis-map.utils';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, SettingsSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { MapExternalCommands } from '../gis-editor-map/map-external-commands';
import { MapMouseActions } from '../gis-editor-map/map-mouse-actions';
import { MapLayersActions } from '../gis-editor-map/map-layers-actions';
import { MapNodeMenu } from '../gis-editor-map/map-node-menu';
import { MapActions } from '../gis-editor-map/map-actions';
import { MapMenu } from '../gis-editor-map/map-menu';
import { MapFiberMenu } from '../gis-editor-map/map-fiber-menu';
import { MapNodeRemove } from '../gis-editor-map/map-node-remove';

GisMapUtils.fixLeafletMarkers();

@Component({
  selector: 'rtu-gis-map',
  templateUrl: './gis-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  private store: Store<AppState> = inject(Store<AppState>);

  private popupBinder!: LeafletAngularPopupBinder;

  constructor(
    private injector: Injector,
    public gisMapService: GisMapService,
    private ts: TranslateService,
    appRef: ApplicationRef,
    envInjector: EnvironmentInjector
  ) {
    super();
    MapActions.initialize(injector);
    MapMenu.initialize(injector);
    MapLayersActions.initialize(injector);
    MapMouseActions.initialize(injector);
    MapActions.initialize(injector);
    MapNodeRemove.initialize(injector);
    MapNodeMenu.initialize(injector);
    MapFiberMenu.initialize(injector);
    MapExternalCommands.initialize(injector);
    this.popupBinder = new LeafletAngularPopupBinder(appRef, envInjector);
  }

  async ngOnInit(): Promise<void> {
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
    const hasEditPermissions = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasEditGraphPermission
    );
    MapLayersActions.initMap(userSettings, hasEditPermissions);

    this.gisMapService.mapSourceId$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onMapSourceId(d));

    this.gisMapService.geoData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onGeoData(d));

    this.gisMapService.traceRouteData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((x) => this.onTraceRouteData(x));

    this.gisMapService.graphRoutesData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onGraphRoutesData(d));

    this.gisMapService.externalCommand$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((c) => MapExternalCommands.do(c));
  }

  override ngOnDestroy(): void {
    this.popupBinder?.destroy();

    super.ngOnDestroy();
  }

  onMapSourceId(id: number) {
    MapLayersActions.setTileLayer(id, this.gisMapService.getMap());
  }

  onGeoData(data: { geoData: AllGeoData } | null): void {
    this.gisMapService.getLayerGroups().forEach((group) => group.clearLayers());
    if (!data) return;

    data.geoData.fibers.forEach((f) => MapLayersActions.addFiberToLayer(f));
    data.geoData.nodes.forEach((n) => MapLayersActions.addNodeToLayer(n));
  }

  onTraceRouteData(data: { traceRouteData: TraceRouteData } | null): void {
    this.gisMapService.getLayerGroups().forEach((group) => group.clearLayers());
    if (!data) return;
    MapLayersActions.addTraceRoute(data.traceRouteData, true);
  }

  onGraphRoutesData(data: { graphRoutesData: GraphRoutesData } | null): void {
    this.gisMapService.getLayerGroups().forEach((group) => group.clearLayers());
    if (!data) return;
    data.graphRoutesData.routes.forEach((r) => MapLayersActions.addTraceRoute(r, false));
  }
}
