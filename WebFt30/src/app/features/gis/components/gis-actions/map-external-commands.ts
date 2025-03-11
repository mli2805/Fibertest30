import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { firstValueFrom } from 'rxjs';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
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
      case 'CleanTrace':
        this.cleanTrace(cmd.traceId);
        break;
      case 'RemoveTrace':
        this.removeTrace(cmd.traceId);
    }
  }

  static showRtu(nodeId: string) {
    const map = this.gisMapService.getMap();
    map.eachLayer((l) => {
      const id = (<any>l).id;
      if (id === nodeId) {
        const pos = (<any>l)._latlng;
        map.setView(pos);
      }
    });
  }

  static async cleanTrace(traceId: string) {
    const response = await firstValueFrom(this.gisService.getAllGeoData());
    const geoData = GisMapping.fromGrpcGeoData(response.data!);
    this.gisMapService.setGeoData(geoData);
  }

  static async removeTrace(traceId: string) {
    const response = await firstValueFrom(this.gisService.getAllGeoData());
    const geoData = GisMapping.fromGrpcGeoData(response.data!);
    this.gisMapService.setGeoData(geoData);
  }
}
