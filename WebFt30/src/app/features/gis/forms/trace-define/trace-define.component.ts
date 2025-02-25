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
          return await this.forkIt(neighbours, previousNodeId);
        }
      default:
        return await this.forkIt(neighbours, previousNodeId);
    }
  }

  private async forkIt(neighbours: Neighbour[], previousNodeId: string): Promise<boolean> {
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

    const node = neighbours[indexOfSelectedNode].node;
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
    stepModel.fiberIds = neighbours[indexOfSelectedNode].fiberIds;
    this.gisMapService.addStep(stepModel);

    return true;
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
    dialogConfig.positionStrategy = new GlobalPositionStrategy().right('120px').top('350px');
    dialogConfig.disableClose = true;
    dialogConfig.data = { buttons, node, gisMapService: this.gisMapService };
    const dialogRef = this.dialog.open(TraceComponentSelectorComponent, dialogConfig);

    // вернет null если отказался от выбора (нажал Выход)
    const index = <number | null>await firstValueFrom(dialogRef.closed);
    if (index === null) return null;
    if (index === -1) return GisMapUtils.emptyGuid;
    return equips[index].id;
  }

  private justStep(neighbour: Neighbour): boolean {
    return true;
  }

  onStepBackward() {
    //
  }

  onCancelStep() {
    //
  }

  onApply() {
    this.close();
  }

  onDiscard() {
    this.close();
  }

  close() {
    this.gisMapService.showTraceDefine.next(null);
  }
}
