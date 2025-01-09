import { Injectable } from '@angular/core';
import { GisMapLayer } from './models/gis-map-layer';
import { BehaviorSubject } from 'rxjs';
import { GraphRoutesData, TraceRouteData } from 'src/app/core/store/models/ft30/geo-data';

@Injectable()
export class GisMapService {
  public static GisMapLayerZoom = new Map<GisMapLayer, number>([
    [GisMapLayer.Route, 0],
    [GisMapLayer.TraceEquipment, 13],
    [GisMapLayer.Locations, 16]
  ]);

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
}
