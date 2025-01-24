import { Injectable } from '@angular/core';
import { GisMapLayer } from './models/gis-map-layer';
import { BehaviorSubject } from 'rxjs';
import {
  AllGeoData,
  GraphRoutesData,
  TraceRouteData
} from 'src/app/core/store/models/ft30/geo-data';
import * as L from 'leaflet';
import { GisMapUtils } from './components/shared/gis-map.utils';

@Injectable()
export class GisMapService {
  public static GisMapLayerZoom = new Map<GisMapLayer, number>([
    [GisMapLayer.Route, 0],
    [GisMapLayer.TraceEquipment, 13],
    [GisMapLayer.EmptyNodes, 16],
    [GisMapLayer.AdjustmentPoints, 19]
  ]);

  /////////////////////
  private geoData!: AllGeoData;
  getGeoData(): AllGeoData {
    return this.geoData;
  }

  private geoDataSubject = new BehaviorSubject<{ geoData: AllGeoData } | null>(null);
  geoData$ = this.geoDataSubject.asObservable();

  // внешний компонент получает данные от сервера и засовывает их в этот сервис
  setGeoData(geoData: AllGeoData): void {
    this.geoData = geoData;
    this.geoDataSubject.next({ geoData });
  }

  ////////////////////
  private traceRouteDataSubject = new BehaviorSubject<{
    traceRouteData: TraceRouteData;
  } | null>(null);

  traceRouteData$ = this.traceRouteDataSubject.asObservable();

  setRouteData(traceRouteData: TraceRouteData): void {
    this.traceRouteDataSubject.next({
      traceRouteData: traceRouteData
    });
  }

  /////////////////////
  private graphRoutesDataSubject = new BehaviorSubject<{ graphRoutesData: GraphRoutesData } | null>(
    null
  );

  graphRoutesData$ = this.graphRoutesDataSubject.asObservable();

  setGraphRoutesData(graphRoutesData: GraphRoutesData): void {
    this.graphRoutesDataSubject.next({ graphRoutesData });
  }

  ///////////////////////
  private map!: L.Map;

  setMap(map: L.Map): void {
    this.map = map;
  }

  getMap(): L.Map {
    return this.map;
  }

  private layerGroups!: Map<GisMapLayer, L.FeatureGroup>;

  setLayerGroups(groups: Map<GisMapLayer, L.FeatureGroup>) {
    this.layerGroups = groups;
  }

  getLayerGroups(): Map<GisMapLayer, L.FeatureGroup> {
    return this.layerGroups;
  }
  //////////////////
  currentZoom = new BehaviorSubject<number>(16);
  currentZoom$ = this.currentZoom.asObservable();

  mousePosition = new BehaviorSubject<string>('');
  mousePosition$ = this.mousePosition.asObservable();

  /////////////////////////
  addSectionMode = false;
  addSectionFromNodeId = GisMapUtils.emptyGuid;
}
