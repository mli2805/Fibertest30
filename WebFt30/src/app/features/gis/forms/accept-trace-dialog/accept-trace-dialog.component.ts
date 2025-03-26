import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, Inject } from '@angular/core';
import { StepModel } from '../trace-define/step-model';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { FiberStateItem, GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { GraphService } from 'src/app/core/grpc';
import { BehaviorSubject } from 'rxjs';
import { TraceDefineUtils } from '../trace-define/trace-define-utils';

@Component({
  selector: 'rtu-accept-trace-dialog',
  templateUrl: './accept-trace-dialog.component.html'
})
export class AcceptTraceDialogComponent {
  public dialogRef: DialogRef<string | null> = inject(DialogRef<string | null>);
  gisMapService!: GisMapService;

  types!: Map<EquipmentType, any>;

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
      trace: TraceDefineUtils.createTrace(),
      rtuTitle: this.gisMapService.steps[0].title,
      lengths: null // для создаваемой трассы null
    };
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
      this.dialogRef.close(null);
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
      trace.fiberIds.forEach((i) => {
        const fiber = this.gisMapService.getGeoData().fibers.find((f) => f.id === i);
        if (fiber === undefined) return;
        fiber.states.push(new FiberStateItem(trace.id, FiberState.NotJoined));
      });
    }

    this.spinning.next(false);
    this.dialogRef.close(trace.id);
  }
}
