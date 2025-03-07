import { Component, Injector, OnInit } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { TraceDefineUtils } from './trace-define-utils';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { Neighbour, StepModel } from './step-model';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { NextStepSelectorComponent } from '../next-step-selector/next-step-selector.component';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { firstValueFrom } from 'rxjs';
import { TraceComponentSelectorComponent } from '../trace-component-selector/trace-component-selector.component';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { TranslateService } from '@ngx-translate/core';
import { EquipmentPipe } from 'src/app/shared/pipes/equipment.pipe';
import { EquipmentType } from 'src/grpc-generated';
import { AcceptTraceDialogComponent } from '../accept-trace-dialog/accept-trace-dialog.component';
import { MapLayersActions } from '../../components/gis-actions/map-layers-actions';

@Component({
  selector: 'rtu-trace-define',
  templateUrl: './trace-define.component.html'
})
export class TraceDefineComponent {
  stepList$ = this.gisMapService.stepList.asObservable();

  constructor(
    private injector: Injector,
    public gisMapService: GisMapService,
    private ts: TranslateService,
    private equipmentPipe: EquipmentPipe,
    private dialog: Dialog
  ) {
    TraceDefineUtils.initialize(injector);
  }

  onStepForward() {
    this.makeStepForward(true);
  }

  private async makeStepForward(isButtonPressed: boolean): Promise<boolean> {
    const lastId = this.gisMapService.steps.at(-1)!.nodeId;
    const neighbours = TraceDefineUtils.getNeighboursPassingThroughAdjustmentPoints(lastId);
    const previousNodeId =
      this.gisMapService.steps.length === 1
        ? GisMapUtils.emptyGuid
        : this.gisMapService.steps.at(-2)!.nodeId;

    switch (neighbours.length) {
      case 0:
        window.alert('There is no available node. /n If you need to continue, press <Cancel Step>');
        return false;
      case 1:
        if (neighbours[0].node.id !== previousNodeId) return this.justStep(neighbours[0]);
        if (!isButtonPressed) return false;
        window.alert('It is an end node. /n If you need to continue, press <Step backward>');
        return false;
      case 2:
        if (previousNodeId === neighbours[0].node.id) {
          return this.justStep(neighbours[1]);
        } else if (previousNodeId === neighbours[1].node.id) {
          return this.justStep(neighbours[0]);
        } else {
          return await this.forkIt(neighbours);
        }
      default:
        return await this.forkIt(neighbours);
    }
  }

  private async forkIt(neighbours: Neighbour[]): Promise<boolean> {
    // выбрать узел из соседних
    // вернет null если отказался от выбора
    const indexOfSelectedNode = await this.selectNeighbour(neighbours);
    if (indexOfSelectedNode === null) {
      const lastId = this.gisMapService.steps.at(-1)!.nodeId;
      this.gisMapService.setHighlightNode(lastId);
      return false;
    }

    // выбрать оборудование из имеющегося в узле (можно редактировать название и каб запас существующего оборудования )
    // вернет GUID.empty если не включать в трассу никакое оборудование
    // вернет null если отказался от выбора (значит отказался от уже выбранного узла)
    const equipmentId = await this.selectEquipment(neighbours[indexOfSelectedNode].node);
    if (equipmentId === null) {
      const lastId = this.gisMapService.steps.at(-1)!.nodeId;
      this.gisMapService.setHighlightNode(lastId);
      return false;
    }

    const neighbour = neighbours[indexOfSelectedNode];
    this.addAndHighlighStep(neighbour, equipmentId);
    return true;
  }

  private createStepModel(neighbour: Neighbour, equipmentId: string): StepModel {
    const node = neighbour.node;
    const equipmentTitle =
      equipmentId === GisMapUtils.emptyGuid
        ? ''
        : this.gisMapService.getGeoData().equipments.find((e) => e.id === equipmentId)!.title;
    const stepModel = new StepModel();
    stepModel.nodeId = node.id;
    stepModel.equipmentId = equipmentId;
    // prettier-ignore
    stepModel.title =
      node.title === ''
        ? equipmentTitle === ''
          ? this.ts.instant('i18n.ft.noname-node')
          : '/ ' + equipmentTitle
        : equipmentTitle === ''
          ? node.title
          : node.title + ' / ' + equipmentTitle;
    stepModel.fiberIds = neighbour.fiberIds;
    return stepModel;
  }

  private async selectNeighbour(neighbours: Neighbour[]): Promise<number | null> {
    const buttons = new Array<RadioButton>();
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      const button = {
        id: i,
        isSelected: i === 0,
        title: neighbour.node.title,
        nodeId: neighbour.node.id
      };
      buttons.push(button);
    }

    this.gisMapService.setHighlightNode(neighbours[0].node.id);

    const dialogConfig = new DialogConfig<unknown, DialogRef>();
    dialogConfig.positionStrategy = new GlobalPositionStrategy().right('120px').top('350px');
    dialogConfig.disableClose = true;
    dialogConfig.data = { buttons, service: this.gisMapService };
    const dialogRef = this.dialog.open(NextStepSelectorComponent, dialogConfig);

    // вернет null если отказался от выбора
    return <number | null>await firstValueFrom(dialogRef.closed);
  }

  private async selectEquipment(node: TraceNode): Promise<string | null> {
    const buttons = new Array<RadioButton>();
    const equips = this.gisMapService
      .getGeoData()
      .equipments.filter((e) => e.nodeId === node.id && e.type !== EquipmentType.EmptyNode);
    for (let i = 0; i < equips.length; i++) {
      const equipment = equips[i];
      const button = {
        id: i,
        isSelected: i === 0,
        title: this.ts.instant(this.equipmentPipe.transform(equipment.type)),
        equipment
      };
      buttons.push(button);
    }

    const dialogConfig = new DialogConfig<unknown, DialogRef>();
    dialogConfig.positionStrategy = new GlobalPositionStrategy().right('120px').top('150px');
    dialogConfig.disableClose = true;
    dialogConfig.data = { buttons, node, gisMapService: this.gisMapService };
    const dialogRef = this.dialog.open(TraceComponentSelectorComponent, dialogConfig);

    // вернет null если отказался от выбора (нажал Выход)
    const index = <number | null>await firstValueFrom(dialogRef.closed);
    if (index === null) return null;
    if (index === -1) return GisMapUtils.emptyGuid;
    return equips[index].id;
  }

  private async justStep(neighbour: Neighbour): Promise<boolean> {
    this.gisMapService.setHighlightNode(neighbour.node.id);

    // выбрать оборудование из имеющегося в узле (можно редактировать название и каб запас существующего оборудования )
    // вернет GUID.empty если не включать в трассу никакое оборудование
    // вернет null если отказался от выбора (значит отказался от уже выбранного узла)
    const equipmentId = await this.selectEquipment(neighbour.node);
    if (equipmentId === null) {
      const lastId = this.gisMapService.steps.at(-1)!.nodeId;
      this.gisMapService.setHighlightNode(lastId);
      return false;
    }

    this.addAndHighlighStep(neighbour, equipmentId);
    return true;
  }

  private addAndHighlighStep(neighbour: Neighbour, equipmentId: string) {
    const stepModel = this.createStepModel(neighbour, equipmentId);
    this.gisMapService.addStep(stepModel);
    for (let i = 0; i < stepModel.fiberIds.length; i++) {
      const fiberId = stepModel.fiberIds[i];
      const fiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;
      MapLayersActions.highlightFiber(fiber);
    }
  }

  async onStepBackward() {
    // если 1, то мы стоим в RTU,
    // если 2, то сделали 1 шаг из RTU и возвращаться нельзя
    if (this.gisMapService.steps.length < 3) return;

    const backwardNodeId = this.gisMapService.steps.at(-2)!.nodeId;
    const backwardNode = this.gisMapService.getNode(backwardNodeId);
    const neighbour = new Neighbour();
    neighbour.node = backwardNode;
    neighbour.fiberIds = this.gisMapService.steps.at(-2)!.fiberIds;

    await this.justStep(neighbour);
  }

  onCancelStep() {
    if (this.gisMapService.steps.length === 1) return;

    const stepToRemove = this.gisMapService.steps.at(-1);
    for (let i = 0; i < stepToRemove!.fiberIds.length; i++) {
      const fiberId = stepToRemove!.fiberIds[i];
      const fiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;
      MapLayersActions.extinguishFiber(fiber);
    }

    this.gisMapService.cancelLastStep();
    const last = this.gisMapService.steps.at(-1);
    this.gisMapService.setHighlightNode(last!.nodeId);
  }

  async onApply() {
    const dialogRef = this.dialog.open(AcceptTraceDialogComponent, {
      disableClose: true,
      data: { service: this.gisMapService }
    });

    const result = await firstValueFrom(dialogRef.closed);

    if (result) {
      MapLayersActions.extinguishAllFibers(true);

      this.close();
    }
  }

  onDiscard() {
    MapLayersActions.extinguishAllFibers();
    this.close();
  }

  close() {
    this.gisMapService.setHighlightNode(null);
    this.gisMapService.showTraceDefine.next(null);
  }
}
