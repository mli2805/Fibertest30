import { Injectable } from '@angular/core';
import { GisMapLayer } from './models/gis-map-layer';
import { BehaviorSubject } from 'rxjs';
import { GraphRoutesData, TraceRouteData } from 'src/app/core/store/models/ft30/graph-data';

@Injectable()
export class GisMapService {
  public static InitialLayerVisibility = new Map<GisMapLayer, boolean>([
    [GisMapLayer.Route, true],
    [GisMapLayer.Locations, true]
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
