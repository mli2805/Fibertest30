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
import { CoreUtils } from 'src/app/core/core.utils';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { Store } from '@ngrx/store';

export class MapRtuMenu {
  private static ts: TranslateService;
  private static gisMapService: GisMapService;
  private static windowService: WindowService;
  private static graphService: GraphService;
  private static dialog: Dialog;
  private static store: Store<AppState>;

  static initialize(injector: Injector) {
    this.ts = injector.get(TranslateService);
    this.gisMapService = injector.get(GisMapService);
    this.windowService = injector.get(WindowService);
    this.graphService = injector.get(GraphService);
    this.dialog = injector.get(Dialog);
    this.store = injector.get(Store);
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

  static canRemoveRtu(nodeId: string): boolean {
    const idx = this.gisMapService.getGeoData().traces.findIndex((t) => t.nodeIds.includes(nodeId));
    const hasTraces = idx !== -1;

    if (!hasTraces) return true;

    const rtuGeoEquipment = this.gisMapService
      .getGeoData()
      .equipments.find((e) => e.nodeId === nodeId)!;
    const isRtuAvailable =
      CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(rtuGeoEquipment.id))
        ?.isRtuAvailable ?? false;

    // даже если есть трассы, то можно удалять НЕдоступные RTU, (очистить трассы при этом)
    return !isRtuAvailable;
  }

  static async removeRtu(e: L.ContextMenuItemClickEvent) {
    const nodeId = (<any>e.relatedTarget).id;
    this.removeRtuInner(nodeId);
  }

  // эта функция вызывается из дерева тоже
  static async removeRtuInner(nodeId: string) {
    const rtuGeoEquipment = this.gisMapService
      .getGeoData()
      .equipments.find((e) => e.nodeId === nodeId)!;
    const rtu = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectRtu(rtuGeoEquipment.id)
    )!;

    const confirmation = await MessageBoxUtils.show(this.dialog, 'Confirmation', [
      { message: 'i18n.ft.attention', bold: false, bottomMargin: false },
      { message: 'i18n.ft.rtu-removal', bold: false, bottomMargin: true },
      { message: rtuGeoEquipment.title, bold: true, bottomMargin: true },
      { message: 'i18n.ft.all-module-traces-will-be-cleared', bold: false, bottomMargin: true },
      { message: 'i18n.ft.are-you-sure', bold: false, bottomMargin: false }
    ]);

    if (!confirmation) return;

    const command = {
      RtuNodeId: rtuGeoEquipment.nodeId,
      RtuId: rtuGeoEquipment.id
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
