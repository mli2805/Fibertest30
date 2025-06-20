import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { GeoTrace, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { TranslateService } from '@ngx-translate/core';
import { Neighbour, StepModel } from './step-model';
import { EquipmentType } from 'src/grpc-generated';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

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

  static getNeighboursPassingThroughAdjustmentPoints(
    nodeId: string,
    previousStep: string
  ): Neighbour[] {
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
        if (nodeNeighbour.id === previousStep) {
          neighbour.previous = true;
          res.push(neighbour);
        } else {
          res.unshift(neighbour);
        }
      }
    });

    return res;
  }

  static getStepTitle(step: StepModel) {
    if (step.title && step.title.length > 0) return step.title;
    return this.ts.instant('i18n.ft.noname-node');
  }

  static createTrace(): GeoTrace {
    const steps = this.gisMapService.stepList.value;
    const nodeIds: string[] = [];
    const equipmentIds: string[] = [];
    const fiberIds: string[] = [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // к очередному узлу может вести несколько участков с точками привязки
      // 1) на первом шаге (RTU) step.fiberIds пустой, в цикл не попадаем
      // 2) если step.fiberIds.length === 1 - нету точек привязки, просто шаг,  в цикл не попадаем
      for (let j = 0; j < step.fiberIds.length - 1; j++) {
        const fiberId = step.fiberIds[j];
        const fiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === fiberId)!;
        const anotherNodeId = fiber.node1id === nodeIds.at(-1) ? fiber.node2id : fiber.node1id;
        const adjustmentPointId = this.gisMapService
          .getGeoData()
          .equipments.find(
            (e) => e.nodeId === anotherNodeId && e.type === EquipmentType.AdjustmentPoint
          )!.id;
        fiberIds.push(fiberId);
        nodeIds.push(anotherNodeId);
        equipmentIds.push(adjustmentPointId);
      }

      if (i > 0) {
        fiberIds.push(step.fiberIds.at(-1)!);
      }

      nodeIds.push(step.nodeId);
      equipmentIds.push(step.equipmentId);
    }

    return new GeoTrace(
      crypto.randomUUID(),
      '',
      nodeIds,
      equipmentIds,
      fiberIds,
      false,
      FiberState.NotJoined,
      true,
      ''
    );
  }
}
