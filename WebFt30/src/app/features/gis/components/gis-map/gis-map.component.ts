import * as L from 'leaflet';
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
import { GisMapLayer } from '../../models/gis-map-layer';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { takeUntil } from 'rxjs';
import { GraphRoutesData, TraceRouteData } from 'src/app/core/store/models/ft30/geo-data';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { TranslateService } from '@ngx-translate/core';
import { GisMapUtils } from '../shared/gis-map.utils';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';
import { Store } from '@ngrx/store';
import { AppSettingsService, AppState, SettingsSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { MapExternalCommands } from '../gis-editor-map/map-external-commands';
import { MapMouseActions } from '../gis-editor-map/map-mouse-actions';
import { MapLayersActions } from '../gis-editor-map/map-layers-actions';
import { MapNodeMenu } from '../gis-editor-map/map-node-menu';
import { MapActions } from '../gis-editor-map/map-actions';

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
    MapExternalCommands.initialize(injector);
    MapLayersActions.initialize(injector);
    MapMouseActions.initialize(injector);
    MapNodeMenu.initialize(injector);

    this.popupBinder = new LeafletAngularPopupBinder(appRef, envInjector);
  }

  async ngOnInit(): Promise<void> {
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
    MapActions.initMap(userSettings);

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

  onTraceRouteData(data: { traceRouteData: TraceRouteData } | null): void {
    this.gisMapService.getLayerGroups().forEach((group) => group.clearLayers());
    if (!data) return;
    this.addTraceRoute(data.traceRouteData);
  }

  onGraphRoutesData(data: { graphRoutesData: GraphRoutesData } | null): void {
    this.gisMapService.getLayerGroups().forEach((group) => group.clearLayers());
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
      const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
      group.addLayer(polyline);

      route.nodes.forEach((node) => {
        MapLayersActions.addNodeToLayer(node);
      });
    }
  }

  private addTraceRoute(route: TraceRouteData): void {
    const latLngs = route.nodes.map((n) => n.coors);
    const polyline = L.polyline(latLngs, { color: ColorUtils.routeStateToColor(route.traceState) });
    const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
    group.addLayer(polyline);

    route.nodes.forEach((node) => {
      MapLayersActions.addNodeToLayer(node);
    });

    const bounds = new L.LatLngBounds(latLngs);
    this.gisMapService.getMap().fitBounds(bounds);
  }
}
