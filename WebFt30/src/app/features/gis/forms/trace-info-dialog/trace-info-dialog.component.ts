import { Component, HostListener, inject, Input } from '@angular/core';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
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
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';

@Component({
    selector: 'rtu-trace-info-dialog',
    templateUrl: './trace-info-dialog.component.html',
    standalone: false
})
export class TraceInfoDialogComponent {
  rtuId!: string;

  traceInfoData!: any;
  @Input() zIndex!: number;

  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  @Input() set traceId(value: string) {
    this.collectTraceInfoDataFromExistingTrace(value);
  }

  public store: Store<AppState> = inject(Store);
  constructor(
    private gisMapService: GisMapService,
    private windowRef: WindowRefService,
    private windowService: WindowService,
    private graphService: GraphService
  ) {}

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

      await this.applyChanges(trace);

      this.spinning.next(false);
    }

    this.windowService.unregisterWindow(this.traceInfoData.trace.id, 'TraceInfo');
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

  close() {
    this.windowService.unregisterWindow(this.traceInfoData.trace.id, 'TraceInfo');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.windowService.unregisterWindow(this.traceInfoData.trace.id, 'TraceInfo');
  }
}
