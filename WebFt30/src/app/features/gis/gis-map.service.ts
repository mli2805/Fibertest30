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
    [GisMapLayer.TraceEquipment, 16],
    [GisMapLayer.EmptyNodes, 16],
    [GisMapLayer.AdjustmentPoints, 16]
  ]);
  // public static GisMapLayerZoom = new Map<GisMapLayer, number>([]);

  ///////////////////// все узлы и участки для карты root'а
  private geoData!: AllGeoData;
  getGeoData(): AllGeoData {
    return this.geoData;
  }

  private geoDataSubject = new BehaviorSubject<{ geoData: AllGeoData } | null>(null);
  geoData$ = this.geoDataSubject.asObservable();

  setGeoData(geoData: AllGeoData): void {
    this.geoData = geoData;
    this.geoDataSubject.next({ geoData });
  }

  //////////////////// одна трасса для показа на форме опт соб
  private traceRouteDataSubject = new BehaviorSubject<{
    traceRouteData: TraceRouteData;
  } | null>(null);

  traceRouteData$ = this.traceRouteDataSubject.asObservable();

  setRouteData(traceRouteData: TraceRouteData): void {
    this.traceRouteDataSubject.next({
      traceRouteData: traceRouteData
    });
  }

  ///////////////////// все трассы для полной карты без редактирования
  private graph!: GraphRoutesData;
  public getGraph(): GraphRoutesData {
    return this.graph;
  }

  private graphRoutesDataSubject = new BehaviorSubject<{ graphRoutesData: GraphRoutesData } | null>(
    null
  );

  graphRoutesData$ = this.graphRoutesDataSubject.asObservable();

  setGraphRoutesData(graphRoutesData: GraphRoutesData): void {
    this.graph = graphRoutesData;
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

  mapSourceId = new BehaviorSubject<number>(1);
  mapSourceId$ = this.mapSourceId.asObservable();

  private layerGroups!: Map<GisMapLayer, L.FeatureGroup>;

  setLayerGroups(groups: Map<GisMapLayer, L.FeatureGroup>) {
    this.layerGroups = groups;
  }

  getLayerGroups(): Map<GisMapLayer, L.FeatureGroup> {
    return this.layerGroups;
  }
  //////////////////
  showNodesFromZoom = new BehaviorSubject<number>(16);
  showNodesFromZoom$ = this.showNodesFromZoom.asObservable();
  setShowNodesFromZoom(fromZoom: number) {
    this.showNodesFromZoom.next(fromZoom);

    GisMapService.GisMapLayerZoom.set(GisMapLayer.TraceEquipment, fromZoom);
    GisMapService.GisMapLayerZoom.set(GisMapLayer.EmptyNodes, fromZoom);
    GisMapService.GisMapLayerZoom.set(GisMapLayer.AdjustmentPoints, fromZoom);
  }

  currentZoom = new BehaviorSubject<number>(16);
  currentZoom$ = this.currentZoom.asObservable();

  mousePosition = new BehaviorSubject<string>('');
  mousePosition$ = this.mousePosition.asObservable();

  showTraceDefine = new BehaviorSubject<boolean>(false);
  showTraceDefine$ = this.showTraceDefine.asObservable();

  /////////////////////////
  addSectionMode = false;
  addSectionFromNodeId = GisMapUtils.emptyGuid;

  //////////////////////////////
  externalCommand = new BehaviorSubject<any>({});
  externalCommand$ = this.externalCommand.asObservable();
}
