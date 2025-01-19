import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import { GisMapService } from '../../gis-map.service';
import { Injector } from '@angular/core';
import { EquipmentType } from 'src/grpc-generated';

export class MapNodeMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
  }

  static buildMarkerContextMenu(equipmentType: EquipmentType): L.ContextMenuItem[] {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return MapNodeMenu.buildRtuContextMenu();
      case EquipmentType.AdjustmentPoint:
        return MapNodeMenu.buildAdjustmentPointContextMenu();
      default:
        return MapNodeMenu.buildNodeContextMenu();
    }
  }

  static buildRtuContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.define-trace'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      }
    ];
  }

  static buildNodeContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-equipment'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addEquipment(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      }
    ];
  }

  static buildAdjustmentPointContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.remove'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeNode(e)
      }
    ];
  }

  static showInformation(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  static addEquipment(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  static removeNode(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  static drawSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }
}
