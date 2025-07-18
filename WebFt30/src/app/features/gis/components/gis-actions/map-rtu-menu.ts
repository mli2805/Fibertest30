import * as L from 'leaflet';
import 'leaflet-contextmenu';
import { Dialog } from '@angular/cdk/dialog';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GraphService } from 'src/app/core/grpc';
import { GisMapService } from '../../gis-map.service';
import { MapNodeMenu } from './map-node-menu';
import { StepModel } from '../../forms/trace-define/step-model';
import { MessageBoxUtils } from 'src/app/shared/components/message-box/message-box-utils';
import { MapNodeRemove } from './map-node-remove';
import { RtuInfoMode } from '../../forms/add-rtu-dialog/rtu-info/rtu-info.component';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';

export class MapRtuMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;
  private static windowService: WindowService;
  private static graphService: GraphService;
  private static dialog: Dialog;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
    this.windowService = injector.get(WindowService);
    this.graphService = injector.get(GraphService);
    this.dialog = injector.get(Dialog);
  }

  static buildRtuContextMenu(hasEditPermissions: boolean, nodeId: string): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showRtuInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.landmarks'),
        callback: (e: L.ContextMenuItemClickEvent) => this.openLandmarks(e),
        disabled: !hasEditPermissions
      },
      {
        text: this.ts.instant('i18n.ft.remove'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeRtu(e),
        disabled: !hasEditPermissions || !this.canRemoveRtu(nodeId)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => MapNodeMenu.drawSection(e, false),
        disabled: !hasEditPermissions
      },
      {
        text: this.ts.instant('i18n.ft.section-with-nodes'),
        callback: (e: L.ContextMenuItemClickEvent) => MapNodeMenu.drawSection(e, true),
        disabled: !hasEditPermissions
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.define-trace'),
        callback: (e: L.ContextMenuItemClickEvent) => this.defineTrace(e),
        disabled: !hasEditPermissions
      }
    ];
  }

  static async showRtuInformation(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    const node = this.gisMapService.getNode(nodeId);

    this.windowService.registerWindow(nodeId, 'RtuInfo', {
      mode: RtuInfoMode.ShowInformation,
      node: node
    });
  }

  static openLandmarks(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;

    const traces = this.gisMapService.getGeoData().traces.filter((t) => t.nodeIds.includes(nodeId));
    if (traces.length === 0) return;

    this.windowService.registerWindow(crypto.randomUUID(), 'Landmarks', {
      traceId: traces[0].id,
      nodeId: null
    });
  }

  // если нету трасс
  static canRemoveRtu(nodeId: string): boolean {
    const idx = this.gisMapService.getGeoData().traces.findIndex((t) => t.nodeIds.includes(nodeId));
    return idx === -1;
  }

  static async removeRtu(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    this.removeRtuInner(nodeId);
  }

  // эта функция вызывается из дерева тоже
  static async removeRtuInner(nodeId: string) {
    const rtu = this.gisMapService.getGeoData().equipments.find((e) => e.nodeId === nodeId)!;

    const confirmation = await MessageBoxUtils.show(this.dialog, 'Confirmation', [
      { message: 'Remove RTU ' + rtu.title, bold: true, bottomMargin: false }
    ]);

    if (!confirmation) return;

    const command = {
      RtuNodeId: rtu.nodeId,
      RtuId: rtu.id
    };
    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'RemoveRtu');
    if (response.success) {
      const node = this.gisMapService.getNode(nodeId);
      MapNodeRemove.RemoveNodeWithAllHisFibersUptoRealNode(node);
    }
  }

  static defineTrace(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    const node = this.gisMapService.getNode(nodeId);

    this.gisMapService.setHighlightNode(nodeId);

    this.gisMapService.clearSteps();
    const firstStepRtu = new StepModel();
    firstStepRtu.nodeId = nodeId;
    firstStepRtu.title = node!.title;
    firstStepRtu.equipmentId = this.gisMapService
      .getGeoData()
      .equipments.find((e) => e.nodeId === nodeId)!.id;
    this.gisMapService.addStep(firstStepRtu);

    this.windowService.registerWindow(firstStepRtu.equipmentId, 'TraceDefine', null);
  }
}
