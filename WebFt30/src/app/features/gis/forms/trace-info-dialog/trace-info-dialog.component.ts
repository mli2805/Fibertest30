import { Component, HostListener, inject } from '@angular/core';
import { TraceInfoMode } from './trace-info/trace-info.component';
import { FiberStateItem, GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from '../../gis-map.service';
import { EquipmentType } from 'src/grpc-generated';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import {
  AppState,
  AuthSelectors,
  RtuTreeActions,
  RtuTreeSelectors,
  WindowRefService
} from 'src/app/core';
import { ExtensionUtils } from 'src/app/core/extension.utils';
import { GisMapUtils } from '../../components/shared/gis-map.utils';
import { StepModel } from '../trace-define/step-model';
import { TraceDefineUtils } from '../trace-define/trace-define-utils';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

@Component({
  selector: 'rtu-trace-info-dialog',
  templateUrl: './trace-info-dialog.component.html'
})
export class TraceInfoDialogComponent {
  traceInfoMode = TraceInfoMode;
  mode!: TraceInfoMode;
  rtuId!: string;
  traceInfoData!: any;

  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  public store: Store<AppState> = inject(Store);
  constructor(
    private gisMapService: GisMapService,
    private windowRef: WindowRefService,
    private graphService: GraphService
  ) {
    this.mode = gisMapService.showTraceInfoDialogMode;

    if (this.mode === TraceInfoMode.CreateTrace) {
      this.collectTraceInfoFromStepModels(gisMapService.steps);
    } else {
      this.collectTraceInfoDataFromExistingTrace(gisMapService.traceIdToShowInfo);
    }
  }

  collectTraceInfoDataFromExistingTrace(traceId: string) {
    const trace = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectTrace(traceId))!;
    this.rtuId = trace.rtuId;
    const rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;
    const hasPermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasEditGraphPermission
    );

    const geoData = this.gisMapService.getGeoData();
    if (geoData === undefined) {
      this.windowRef.reload();
      return;
    }
    const geoTrace = geoData.traces.find((t) => t.id === traceId);
    this.prepareStatForInnerComponent(geoTrace!);
    this.traceInfoData = {
      hasPermission: hasPermission,
      types: Array.from(this.types, ([type, value]) => ({ type, count: value.count })),
      trace: geoTrace,
      rtuTitle: rtu.title,
      port: ExtensionUtils.PortOfOtauToString(trace.port),
      length: null
    };
  }

  collectTraceInfoFromStepModels(steps: StepModel[]) {
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

    this.traceInfoData = {
      hasPermission: true,
      // какого типа оборудования сколько в базе
      types: Array.from(this.types, ([type, value]) => ({ type, count: value.count })),
      trace: TraceDefineUtils.createTrace(),
      rtuTitle: this.gisMapService.steps[0].title,
      lengths: null // для создаваемой трассы null
    };
  }

  types!: Map<EquipmentType, any>;
  prepareStatForInnerComponent(trace: GeoTrace) {
    this.types = new Map();

    trace.equipmentIds.forEach((i) => {
      const equipment = this.gisMapService.getGeoData().equipments.find((e) => e.id === i);
      this.setOrIncrement(equipment!.type, 1);
    });
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
    if (trace !== null) {
      this.spinning.next(true);

      if (this.mode === TraceInfoMode.CreateTrace) {
        await this.addNewTrace(trace);
      } else {
        await this.applyChanges(trace);
      }

      this.spinning.next(false);
    }
    this.gisMapService.showTraceInfoDialog.next(false);
  }

  async applyChanges(trace: GeoTrace) {
    const cmd = {
      Id: trace.id,
      Title: trace.title,
      Mode: trace.darkMode ? 0 : 1,
      Comment: trace.comment
    };
    const json = JSON.stringify(cmd);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'UpdateTrace'));
    if (response.success) {
      this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: this.rtuId }));
    }
  }

  async addNewTrace(trace: GeoTrace) {
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
    // форма traceDefine получив applyDefinedTraceId, закроет этот диалог
    // т.к. значение не null то и сама traceDefine закроется
    this.gisMapService.applyDefinedTraceId.next(trace.id);
  }

  close() {
    this.gisMapService.showTraceInfoDialog.next(false);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.gisMapService.showTraceInfoDialog.next(false);
  }
}
