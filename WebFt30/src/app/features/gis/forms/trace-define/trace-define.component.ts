import { Component, Injector, OnInit } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { TraceDefineUtils } from './trace-define-utils';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { Neighbour } from './step-model';

@Component({
  selector: 'rtu-trace-define',
  templateUrl: './trace-define.component.html',
  styleUrls: ['./trace-define.component.scss']
})
export class TraceDefineComponent {
  stepList$ = this.gisMapService.stepList.asObservable();

  constructor(private injector: Injector, public gisMapService: GisMapService) {
    TraceDefineUtils.initialize(injector);
  }

  onStepForward() {
    this.makeStepForward(true);
  }

  private makeStepForward(isButtonPressed: boolean): boolean {
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
          return this.forkIt(neighbours, previousNodeId);
        }
      default:
        return this.forkIt(neighbours, previousNodeId);
    }
  }

  private forkIt(neighbours: Neighbour[], previousNodeId: string): boolean {
    return true;
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
