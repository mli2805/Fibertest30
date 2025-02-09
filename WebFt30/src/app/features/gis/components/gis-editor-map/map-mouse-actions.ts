import * as L from 'leaflet';
import { inject, Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsActions } from 'src/app/core';
import { GisMapLayers } from '../shared/gis-map-layers';
import { GisMapLayer } from '../../models/gis-map-layer';

export class MapMouseActions {
  private static gisMapService: GisMapService;
  private static store: Store<AppState>;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.store = injector.get(Store<AppState>);
  }

  static lineInProgress: L.Polyline;
  static onMouseMove(pos: L.LatLng) {
    const center = this.gisMapService.getMap().getCenter();
    this.gisMapService.mousePosition.next(GisMapUtils.mouseToString(pos));

    if (this.gisMapService.addSectionMode) {
      if (this.lineInProgress !== undefined) {
        this.gisMapService.getMap().removeLayer(this.lineInProgress);
      }

      const options = { color: 'black', weight: 1 };
      this.lineInProgress = L.polyline([this.gisMapService.addSectionFromCoors, pos], options);
      const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
      group.addLayer(this.lineInProgress);
    }
  }

  static onZoom() {
    const newZoom = this.gisMapService.getMap().getZoom();
    GisMapLayers.adjustLayersToZoom(
      this.gisMapService.getMap(),
      this.gisMapService.getLayerGroups(),
      this.gisMapService.currentZoom.value,
      newZoom
    );
    this.gisMapService.currentZoom.next(newZoom);
    this.store.dispatch(SettingsActions.changeZoom({ zoom: newZoom }));
  }

  static onClick(pos: L.LatLng) {
    this.gisMapService.mousePosition.next(GisMapUtils.mouseToString(pos));
  }

  static onDragEnd() {
    const center = this.gisMapService.getMap().getCenter();
    this.store.dispatch(SettingsActions.changeCenter({ center }));
  }
}
