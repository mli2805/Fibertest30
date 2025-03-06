import * as L from 'leaflet';
import { MapActions } from './map-actions';
import { EquipmentType } from 'src/grpc-generated';
import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';

export class MapMenu {
  private static ts: TranslateService;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
  }

  static buildMapMenu(hasEditPermissions: boolean): L.ContextMenuItem[] {
    if (hasEditPermissions) {
      return [
        {
          text: this.ts.instant('i18n.ft.add-node'),
          callback: (e) => MapActions.addNewNode(e, EquipmentType.EmptyNode)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-cable-reserve'),
          callback: (e) => MapActions.addNewNode(e, EquipmentType.CableReserve)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-closure'),
          callback: (e) => MapActions.addNewNode(e, EquipmentType.Closure)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-cross'),
          callback: (e) => MapActions.addNewNode(e, EquipmentType.Cross)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-terminal'),
          callback: (e) => MapActions.addNewNode(e, EquipmentType.Terminal)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-other-equipment'),
          callback: (e) => MapActions.addNewNode(e, EquipmentType.Other)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.add-rtu'),
          callback: (e) => MapActions.addNewNode(e, EquipmentType.Rtu)
        }
        // {
        //   text: '-',
        //   separator: true
        // }
        // {
        //   text: this.ts.instant('i18n.ft.copy-coordinates'),
        //   callback: (e) => MapActions.copyCoordinates(e)
        // },
        // {
        //   text: this.ts.instant('i18n.ft.distance-measurement'),
        //   callback: (e) => MapActions.copyCoordinates(e)
        // }
      ];
    } else {
      return [
        // {
        //   text: this.ts.instant('i18n.ft.copy-coordinates'),
        //   callback: (e) => MapActions.copyCoordinates(e)
        // },
        // {
        //   text: this.ts.instant('i18n.ft.distance-measurement'),
        //   callback: (e) => MapActions.copyCoordinates(e)
        // }
      ];
    }
  }
}
