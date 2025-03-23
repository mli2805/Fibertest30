import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, Inject } from '@angular/core';
import { StepModel } from '../trace-define/step-model';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { GeoEquipment, GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { GraphService } from 'src/app/core/grpc';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Component({
  selector: 'rtu-accept-trace-dialog',
  templateUrl: './accept-trace-dialog.component.html'
})
export class AcceptTraceDialogComponent {
  public dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
  gisMapService!: GisMapService;

  types!: any;

  traceInfoData!: any;

  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  constructor(@Inject(DIALOG_DATA) private data: any, private graphService: GraphService) {
    this.gisMapService = data.service;
    this.prepareStatForInnerComponent(data.service.steps);

    this.traceInfoData = {
      hasPermission: true,
      // какого типа оборудования сколько в базе
      types: Array.from(this.types, ([type, value]) => ({ type, count: value.count })),
      trace: this.createTrace(data.service.steps),
      rtuTitle: this.gisMapService.steps[0].title,
      lengths: null // для создаваемой трассы null
    };
  }

  createTrace(steps: StepModel[]): GeoTrace {
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

  prepareStatForInnerComponent(steps: StepModel[]) {
    this.types = new Map();
    this.types.set(EquipmentType.Rtu, { count: 1 });

    for (let i = 1; i < steps.length; i++) {
      const step = steps[i];
      if (step.equipmentId === GisMapUtils.emptyGuid) {
        this.setOrIncrement(EquipmentType.EmptyNode);
      } else {
        const equipment = this.gisMapService
          .getGeoData()
          .equipments.find((e) => e.id === step.equipmentId)!;
        this.setOrIncrement(equipment.type);
      }
      if (step.fiberIds.length > 1)
        this.setOrIncrement(EquipmentType.AdjustmentPoint, step.fiberIds.length - 1);
    }
  }

  setOrIncrement(type: EquipmentType, inc = 1) {
    if (this.types.has(type)) {
      this.types.get(type).count++;
    } else {
      this.types.set(type, { count: inc });
    }
  }

  // кнопка нажата в trace-info
  async onCloseEvent(trace: GeoTrace | null) {
    if (trace === null) {
      this.dialogRef.close(false);
      return;
    }

    this.spinning.next(true);

    const rtu = this.gisMapService
      .getGeoData()
      .equipments.find((e) => e.nodeId === trace.nodeIds[0])!;

    const command = {
      TraceId: trace.id,
      RtuId: rtu.id,
      Title: trace.title,
      NodeIds: trace.nodeIds,
      EquipmentIds: trace.equipmentIds,
      FiberIds: trace.fiberIds,
      Comment: trace.comment
    };
    const json = JSON.stringify(command);
    const response = await this.graphService.sendCommandAsync(json, 'AddTrace');

    if (response.success) {
      this.gisMapService.getGeoData().traces.push(trace);
    }

    this.spinning.next(false);
    this.dialogRef.close(response.success);
  }
}
