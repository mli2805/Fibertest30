import * as L from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { EquipmentType } from 'src/grpc-generated';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { MapLayersActions } from './map-layers-actions';

export class MapFiberMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
  }

  static buildFiberContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showSectionInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-node'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addNodeToSection(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-adjustment-point'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addPointToSection(e)
      },
      {
        text: this.ts.instant('i18n.ft.remove-section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeSection(e)
      }
    ];
  }

  static showSectionInformation(e: L.ContextMenuItemClickEvent) {
    // console.log(e);
    // console.log(JSON.stringify(e));
    console.log(e.relatedTarget);
  }

  static async addNodeToSection(e: L.ContextMenuItemClickEvent) {
    await this.addToSection(e, EquipmentType.EmptyNode);
  }

  static async addPointToSection(e: L.ContextMenuItemClickEvent) {
    await this.addToSection(e, EquipmentType.AdjustmentPoint);
  }

  static async addToSection(e: L.ContextMenuItemClickEvent, eqType: EquipmentType) {
    const fiberId = (<any>e.relatedTarget).id;

    const command = {
      Id: crypto.randomUUID(),
      EquipmentId: crypto.randomUUID(),
      Position: e.latlng,
      InjectionType: eqType,
      FiberId: fiberId,
      NewFiberId1: crypto.randomUUID(),
      NewFiberId2: crypto.randomUUID()
    };
    console.log(command);
    const json = JSON.stringify(command);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'AddNodeIntoFiber'));
    if (response.success) {
      const traceNode = new TraceNode(command.Id, '', e.latlng, eqType);
      MapLayersActions.addNodeToLayer(traceNode);
      this.gisMapService.getGeoData().nodes.push(traceNode);

      // удалить старое и добавить 2 новых волокна
    }
  }

  static removeSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }
}
