import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  AppState,
  RtuTreeSelectors,
  AuthSelectors,
  RtuTreeActions,
  WindowRefService
} from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ExtensionUtils } from 'src/app/core/extension.utils';
import { GraphService } from 'src/app/core/grpc';
import { GisMapService } from '../../gis/gis-map.service';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType } from 'src/grpc-generated';

@Component({
  selector: 'rtu-trace-information',
  templateUrl: './trace-information.component.html'
})
export class TraceInformationComponent implements OnInit {
  traceId!: string;
  rtuId!: string;

  traceInfoData!: any;
  hasPermission!: boolean;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  public store: Store<AppState> = inject(Store);
  constructor(
    private windowRef: WindowRefService,
    private route: ActivatedRoute,
    private router: Router,
    public gisMapService: GisMapService,
    private graphService: GraphService
  ) {}

  ngOnInit(): void {
    this.traceId = this.route.snapshot.paramMap.get('id')!;
    const trace = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectTrace(this.traceId)
    )!;
    this.rtuId = trace.rtuId;
    const rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;
    this.hasPermission = CoreUtils.getCurrentState(
      this.store,
      AuthSelectors.selectHasEditGraphPermission
    );

    const geoData = this.gisMapService.getGeoData();
    if (geoData === undefined) {
      this.windowRef.reload();
      return;
    }
    const geoTrace = geoData.traces.find((t) => t.id === this.traceId);
    this.prepareStatForInnerComponent(geoTrace!);

    this.traceInfoData = {
      hasPermission: this.hasPermission,
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

    trace.nodeIds.forEach((i) => {
      const node = this.gisMapService.getNode(i);
      this.setOrIncrement(node.equipmentType, 1);
    });
  }

  setOrIncrement(type: EquipmentType, inc = 1) {
    if (this.types.has(type)) {
      this.types.get(type).count++;
    } else {
      this.types.set(type, { count: inc });
    }
  }

  async onCloseEvent(trace: GeoTrace | null) {
    if (trace !== null) {
      await this.onApplyClicked(trace);
    } else {
      this.router.navigate(['rtus/rtu-tree']);
    }
  }

  isDisabled() {
    return !this.hasPermission;
  }

  async onApplyClicked(trace: GeoTrace) {
    console.log(trace);
    this.loading.next(true);
    const cmd = {
      Id: this.traceId,
      Title: trace.title,
      Mode: trace.darkMode ? 0 : 1,
      Comment: trace.comment
    };
    const json = JSON.stringify(cmd);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'UpdateTrace'));
    if (response.success) {
      this.store.dispatch(RtuTreeActions.getOneRtu({ rtuId: this.rtuId }));
    }
    this.loading.next(false);
  }
}
