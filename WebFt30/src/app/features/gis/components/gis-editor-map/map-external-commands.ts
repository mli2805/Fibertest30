import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
export class MapExternalCommands {
  private static gisMapService: GisMapService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
  }

  static do(cmd: any) {
    switch (cmd.name) {
      case 'ShowRtu':
        this.showRtu(cmd.nodeId);
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
}
