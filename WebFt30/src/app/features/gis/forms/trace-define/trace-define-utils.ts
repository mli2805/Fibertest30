import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { TranslateService } from '@ngx-translate/core';
import { Neighbour, StepModel } from './step-model';
import { EquipmentType } from 'src/grpc-generated';

export class TraceDefineUtils {
  private static gisMapService: GisMapService;
  private static ts: TranslateService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.ts = injector.get(TranslateService);
  }

  static getNeighbours(nodeId: string): TraceNode[] {
    const fibers = this.gisMapService
      .getGeoData()
      .fibers.filter((f) => f.node1id === nodeId || f.node2id === nodeId);
    const neighbourIds = fibers.map((f) => {
      return f.node1id === nodeId ? f.node2id : f.node1id;
    });

    return neighbourIds.map((i) => {
      return this.gisMapService.getGeoData().nodes.find((n) => n.id === i)!;
    });
  }

  static getNeighboursPassingThroughAdjustmentPoints(nodeId: string): Neighbour[] {
    const res = new Array<Neighbour>();

    const fibers = this.gisMapService.getNodeFibers(nodeId);
    fibers.forEach((fiber) => {
      const neighbour = new Neighbour();
      let previousNodeId = nodeId;
      let currentFiber = fiber;
      let neighbourId = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        neighbour.fiberIds.push(currentFiber.id);
        neighbourId =
          currentFiber.node1id === previousNodeId ? currentFiber.node2id : currentFiber.node1id;
        if (this.gisMapService.getNode(neighbourId).equipmentType !== EquipmentType.AdjustmentPoint)
          break;

        previousNodeId = neighbourId;
        currentFiber = this.gisMapService.getAnotherFiberOfAdjustmentPoint(
          neighbourId,
          currentFiber.id
        );
      }
      const nodeNeighbour = this.gisMapService.getNode(neighbourId);
      if (nodeNeighbour.equipmentType !== EquipmentType.Rtu) {
        neighbour.node = nodeNeighbour;
        res.push(neighbour);
      }
    });

    return res;
  }

  static getStepTitle(step: StepModel) {
    if (step.title && step.title.length > 0) return step.title;
    return this.ts.instant('i18n.ft.noname-node');
  }
}
