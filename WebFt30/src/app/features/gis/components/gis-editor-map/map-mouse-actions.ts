import * as L from 'leaflet';
import { inject, Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsActions } from 'src/app/core';

export class MapMouseActions {
  private static gisMapService: GisMapService;
  private static store: Store<AppState>;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.store = injector.get(Store<AppState>);
  }

  static onMouseMove(pos: L.LatLng) {
    const center = this.gisMapService.getMap().getCenter();
    this.gisMapService.mousePosition.next(GisMapUtils.mouseToString(pos, center));
  }

  static onZoom() {
    const newZoom = this.gisMapService.getMap().getZoom();
    // GisMapLayers.adjustLayersToZoom(this.map, this.layerGroups, this.currentZoom.value, newZoom);
    this.gisMapService.currentZoom.next(newZoom);
    this.store.dispatch(SettingsActions.changeZoom({ zoom: newZoom }));
  }

  static onClick(pos: L.LatLng) {
    const center = this.gisMapService.getMap().getCenter();
    this.gisMapService.mousePosition.next(GisMapUtils.mouseToString(pos, center));
  }

  static onDragEnd() {
    const center = this.gisMapService.getMap().getCenter();
    this.store.dispatch(SettingsActions.changeCenter({ center }));
  }
}
