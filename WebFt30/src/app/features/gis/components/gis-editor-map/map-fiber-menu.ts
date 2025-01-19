import * as L from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';

export class MapFiberMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
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
    console.log(e);
  }

  static addNodeToSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }

  static addPointToSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }

  static removeSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }
}
