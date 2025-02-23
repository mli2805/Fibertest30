import { Component, Injector, OnInit } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { TraceDefineUtils } from './trace-define-utils';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { Neighbour } from './step-model';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { NextStepSelectorComponent } from '../next-step-selector/next-step-selector.component';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'rtu-trace-define',
  templateUrl: './trace-define.component.html',
  styleUrls: ['./trace-define.component.scss']
})
export class TraceDefineComponent {
  stepList$ = this.gisMapService.stepList.asObservable();

  constructor(
    private injector: Injector,
    public gisMapService: GisMapService,
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
    // вернет null если отказался от выбора
    const indexOfSelectedNode = await this.selectNeighbour(neighbours);
    console.log(indexOfSelectedNode);

    if (indexOfSelectedNode === null) {
      const lastId = this.gisMapService.steps.at(-1)!.nodeId;
      this.gisMapService.setHighlightNode(lastId);
      return false;
    }

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
    dialogConfig.positionStrategy = new GlobalPositionStrategy().left('120px').top('50px');
    dialogConfig.disableClose = true;
    dialogConfig.data = { buttons, service: this.gisMapService };
    const dialogRef = this.dialog.open(NextStepSelectorComponent, dialogConfig);

    // вернет null если отказался от выбора
    return <number | null>await firstValueFrom(dialogRef.closed);
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
