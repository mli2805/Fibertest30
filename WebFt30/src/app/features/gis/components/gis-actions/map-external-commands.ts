import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { firstValueFrom } from 'rxjs';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import * as L from 'leaflet';
import { MapLayersActions } from './map-layers-actions';
import { Utils } from 'src/app/shared/utils/utils';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
export class MapExternalCommands {
  private static gisMapService: GisMapService;
  private static gisService: GisService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.gisService = injector.get(GisService);
  }

  static do(cmd: any) {
    switch (cmd.name) {
      case 'ShowRtu':
        this.showRtu(cmd.nodeId);
        break;
      case 'ShowTrace':
        this.showTrace(cmd.traceId);
        break;
      case 'TraceCleaned':
        MapLayersActions.cleanTrace(cmd.traceId);
        break;
      case 'TraceRemoved':
        MapLayersActions.removeTrace(cmd.traceId);
        break;
      case 'RtuAdded':
      case 'RtuUpdated':
      case 'RtuRemoved':
        this.reloadAllGeoData();
        break;
      case 'BaseRefsAssigned':
        console.log(cmd);
        this.setTraceHasBaseRefs(cmd.traceId, cmd.hasBaseRef);
        break;
      case 'TraceAttached':
        MapLayersActions.drawTraceWith(cmd.traceId, FiberState.Ok);
        break;
      case 'TraceDetached':
        MapLayersActions.drawTraceWith(cmd.traceId, FiberState.NotJoined);
        break;
      case 'TraceStateChanged':
        MapLayersActions.drawTraceWith(cmd.traceId, cmd.traceState);
        break;
    }
  }

  static async showRtu(nodeId: string) {
    const map = this.gisMapService.getMap();
    map.eachLayer((l) => {
      const id = (<any>l).id;
      if (id === nodeId) {
        const pos = (<any>l)._latlng;
        map.setView(pos);
      }
    });

    for (let i = 0; i < 5; i++) {
      this.gisMapService.setHighlightNode(nodeId);
      await Utils.delay(500);
      this.gisMapService.setHighlightNode(null);
      await Utils.delay(500);
    }
  }

  static async showTrace(traceId: string) {
    const trace = this.gisMapService.getGeoData().traces.find((t) => t.id === traceId);
    if (trace === undefined) return;

    const latLngs = trace.nodeIds.map((i) => this.gisMapService.getNode(i).coors);
    const bounds = new L.LatLngBounds(latLngs);
    this.gisMapService.getMap().fitBounds(bounds);

    for (let i = 0; i < 5; i++) {
      MapLayersActions.drawTraceWith(traceId, FiberState.HighLighted);
      await Utils.delay(500);

      MapLayersActions.drawTraceWith(traceId, trace.state);
      await Utils.delay(500);
    }
  }

  static setTraceHasBaseRefs(traceId: string, hasAnyBaseRef: boolean) {
    const trace = this.gisMapService.getGeoData().traces.find((t) => t.id === traceId);
    if (trace) {
      trace.hasAnyBaseRef = hasAnyBaseRef;
    }
  }

  static async reloadAllGeoData() {
    const response = await firstValueFrom(this.gisService.getAllGeoData());
    const geoData = GisMapping.fromGrpcGeoData(response.data!);
    this.gisMapService.setGeoData(geoData);
    this.gisMapService.geoDataLoading.next(false);
  }
}
