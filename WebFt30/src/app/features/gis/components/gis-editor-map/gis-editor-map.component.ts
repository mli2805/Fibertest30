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
import { takeUntil } from 'rxjs';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { AllGeoData } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppSettingsService, AppState, SettingsSelectors } from 'src/app/core';
import { MapNodeMenu } from './map-node-menu';
import { MapFiberMenu } from './map-fiber-menu';
import { MapActions } from './map-actions';
import { MapMenu } from './map-menu';
import { MapLayersActions } from './map-layers-actions';
import { MapMouseActions } from './map-mouse-actions';
import { MapExternalCommands } from './map-external-commands';

@Component({
  selector: 'rtu-gis-editor-map',
  templateUrl: './gis-editor-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisEditorMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  private store: Store<AppState> = inject(Store<AppState>);

  private popupBinder!: LeafletAngularPopupBinder;

  constructor(
    private injector: Injector,
    public gisMapService: GisMapService,
    appRef: ApplicationRef,
    envInjector: EnvironmentInjector
  ) {
    super();
    MapActions.initialize(injector);
    MapMenu.initialize(injector);
    MapLayersActions.initialize(injector);
    MapMouseActions.initialize(injector);
    MapActions.initialize(injector);
    MapNodeMenu.initialize(injector);
    MapFiberMenu.initialize(injector);
    MapExternalCommands.initialize(injector);
    this.popupBinder = new LeafletAngularPopupBinder(appRef, envInjector);
  }

  async ngOnInit(): Promise<void> {
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
    MapActions.initMap(userSettings);

    this.gisMapService.geoData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onGeoData(d));

    this.gisMapService.externalCommand$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((c) => MapExternalCommands.do(c));
  }

  override ngOnDestroy(): void {
    this.popupBinder?.destroy();

    super.ngOnDestroy();
  }

  geoData!: AllGeoData;
  onGeoData(data: { geoData: AllGeoData } | null): void {
    this.gisMapService.getLayerGroups().forEach((group) => group.clearLayers());

    if (!data) return;
    this.geoData = data.geoData;

    data.geoData.fibers.forEach((f) => MapLayersActions.addFiberToLayer(f));
    data.geoData.nodes.forEach((n) => MapLayersActions.addNodeToLayer(n));
  }
}
