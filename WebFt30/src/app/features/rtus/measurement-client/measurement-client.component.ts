import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LinkMapBase } from '@veex/link-map';
import { SorTrace } from '@veex/sor';
import {
  catchError,
  forkJoin,
  merge,
  mergeMap,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import {
  AppState,
  OnDemandActions,
  OnDemandSelectors,
  OtdrTaskProgress,
  RtuTreeSelectors
} from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { ReportingService, RtuMgmtService } from 'src/app/core/grpc';
import { RouterSelectors } from 'src/app/core/router/router.selectors';
import { RouterStateUrl } from 'src/app/core/router/router.state';
import {
  BranchOfAcceptableMeasParams,
  DistanceMeasParam,
  LeafOfAcceptableMeasParams,
  TreeOfAcceptableMeasurementParameters,
  UnitMeasParam
} from 'src/app/core/store/models/ft30/acceptable-measurement-parameters';
import { DoMeasurementClientDto } from 'src/app/core/store/models/ft30/do-measurement-client-dto';
import {
  FtMeasurementSettings,
  MeasParamByPosition
} from 'src/app/core/store/models/ft30/ft-measurement-settings';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { DefaultParameters } from 'src/app/shared/utils/default-parameters';
import { ValidationUtils } from 'src/app/shared/utils/validation-utils';

@Component({
  selector: 'rtu-measurement-client',
  templateUrl: './measurement-client.component.html',
  styleUrls: ['./measurement-client.component.css']
})
export class MeasurementClientComponent extends OnDestroyBase implements OnInit {
  rtu!: Rtu;
  portOfOtau!: PortOfOtau[]; // 2 ports if on bop
  acceptableParameters!: TreeOfAcceptableMeasurementParameters;

  form!: FormGroup;
  ms: FtMeasurementSettings = new FtMeasurementSettings();

  lasers!: UnitMeasParam[];
  distances!: DistanceMeasParam[];
  resolutions!: string[];
  pulseDurations!: string[];
  periodsToAverage!: string[];

  measurementInProgress$ = this.store.select(RtuMgmtSelectors.selectRtuOperationInProgress);
  measurementClientId$ = this.store.select(RtuMgmtSelectors.selectMeasurementClientId);
  startSuccess$ = this.store.select(RtuMgmtSelectors.selectRtuOperationSuccess);
  error$ = this.store.select(RtuMgmtSelectors.selectErrorMessageId);

  completedMeasurement$: Observable<{ sor: SorTrace | null } | null>;

  constructor(private store: Store<AppState>, rtuMgmtService: RtuMgmtService) {
    super();

    this.completedMeasurement$ = this.measurementClientId$.pipe(
      takeUntil(this.ngDestroyed$),
      mergeMap((id: string | null) => {
        if (id === null) {
          return of(null);
        }
        return forkJoin({
          sor: rtuMgmtService.getMeasurementClientSor(id).pipe(
            mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor)),
            catchError((error) => {
              console.log(error);
              return of(null);
            })
          )
        });
      })
    );

    const subs = this.completedMeasurement$
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap((value) => {
          this.store.dispatch(RtuMgmtActions.getMeasurementClientSorSuccess());
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.getParametersFromUrl();
    this.initializeMeasurementSettigns();

    this.form = new FormGroup({
      laser: new FormControl(this.ms.laser),
      refractiveIndex: new FormControl(this.ms.refractiveIndex, [
        Validators.required,
        Validators.min(DefaultParameters.RefractiveIndexMin),
        Validators.max(DefaultParameters.RefractiveIndexMax),
        Validators.pattern(ValidationUtils.FloatPattern)
      ]),

      backscatteringCoeff: new FormControl(this.ms.backscatteringCoeff, [
        Validators.required,
        Validators.min(DefaultParameters.BackscatteringCoeffMin),
        Validators.max(DefaultParameters.BackscatteringCoeffMax),
        Validators.pattern(ValidationUtils.FloatPattern)
      ]),
      distance: new FormControl(this.ms.distance),
      resolution: new FormControl(this.ms.resolution),
      pulse: new FormControl(this.ms.pulse),
      averagingTime: new FormControl(this.ms.averagingTime)
    });
  }

  isInvalidAndTouched(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  getParametersFromUrl() {
    const routerStateUrl = CoreUtils.getCurrentState(
      this.store,
      RouterSelectors.selectRouterStateUrl
    );
    const parts = routerStateUrl.url.split('/');
    const rtuId = parts[3];
    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(rtuId))!;
    if (this.rtu!.acceptableParams === undefined) return;
    this.acceptableParameters = this.rtu!.acceptableParams;

    const portName = parts[4];
    this.portOfOtau = this.portOfOtauByName(portName);
  }

  portOfOtauByName(portName: string): PortOfOtau[] {
    const result: PortOfOtau[] = [];
    const parts = portName.split('-');
    if (parts.length > 1) {
      result.push(this.getPortOfBop(+parts[0], +parts[1]));
    }
    result.push(this.getPortOfMainCharon(+parts[0]));
    return result;
  }

  getPortOfBop(mainOpticalPort: number, bopOpticalPort: number): PortOfOtau {
    const bop = this.rtu.bops.find((b) => b.masterPort === mainOpticalPort);
    const portOnBop = new PortOfOtau();
    portOnBop.otauId = bop!.bopId;
    portOnBop.otauNetAddress = bop!.bopNetAddress;
    portOnBop.otauSerial = bop!.serial;
    portOnBop.isPortOnMainCharon = false;
    portOnBop.mainCharonPort = mainOpticalPort;
    portOnBop.opticalPort = bopOpticalPort;
    return portOnBop;
  }

  getPortOfMainCharon(opticalPort: number): PortOfOtau {
    const portOnMainCharon = new PortOfOtau();
    portOnMainCharon.otauSerial = this.rtu.serial!;
    portOnMainCharon.isPortOnMainCharon = true;
    portOnMainCharon.opticalPort = opticalPort;
    return portOnMainCharon;
  }

  initializeMeasurementSettigns() {
    this.lasers = this.acceptableParameters.units;
    this.ms.laser = this.acceptableParameters.units[0];
    this.initializeFromUnit(this.acceptableParameters.units[0].branch);
  }

  initializeFromUnit(branch: BranchOfAcceptableMeasParams) {
    this.ms.refractiveIndex = branch.refractiveIndex.toString();
    this.ms.backscatteringCoeff = branch.backscatterCoeff.toString();
    this.distances = branch.distances;
    if (this.ms.distance === null || branch.distances.indexOf(this.ms.distance) === -1) {
      this.ms.distance = branch.distances[0];
    }
    this.initializeFromDistance(branch.distances[0].otherParams);
  }

  initializeFromDistance(leaf: LeafOfAcceptableMeasParams) {
    this.resolutions = leaf.resolutions;
    if (this.ms.resolution === null || leaf.resolutions.indexOf(this.ms.resolution) === -1) {
      this.ms.resolution = leaf.resolutions[0];
    }

    this.pulseDurations = leaf.pulseDurations;
    if (this.ms.pulse === null || leaf.pulseDurations.indexOf(this.ms.pulse) === -1) {
      this.ms.pulse = leaf.pulseDurations[0];
    }

    this.periodsToAverage = leaf.periodsToAverage;
    if (
      this.ms.averagingTime === null ||
      leaf.periodsToAverage.indexOf(this.ms.averagingTime) === -1
    ) {
      this.ms.averagingTime = leaf.periodsToAverage[0];
    }
  }

  onLaserChanged($event: UnitMeasParam) {
    this.ms.laser = $event;
    this.initializeFromUnit($event.branch);
  }

  onDistanceChanged($event: DistanceMeasParam) {
    this.ms.distance = $event;
    this.initializeFromDistance($event.otherParams);
  }

  onPulseChanged($event: string) {
    this.ms.pulse = $event;
  }

  onResolutionChanged($event: string) {
    this.ms.resolution = $event;
  }

  onAveragingTimeChanged($event: string) {
    this.ms.averagingTime = $event;
  }

  onMeasureClicked() {
    const dto = new DoMeasurementClientDto();
    dto.rtuId = this.rtu!.rtuId;
    dto.portOfOtau = this.portOfOtau;
    dto.ms = this.composeMeasurementParamsByPosition();
    this.store.dispatch(RtuMgmtActions.startMeasurementClient({ dto }));
  }

  composeMeasurementParamsByPosition(): MeasParamByPosition[] {
    const ms: MeasParamByPosition[] = [];

    const laser = new MeasParamByPosition();
    laser.param = 1;
    laser.position = this.acceptableParameters.units.indexOf(this.ms.laser);
    ms.push(laser);
    const branch = this.acceptableParameters.units[laser.position].branch;

    const backscatterCoeff = new MeasParamByPosition();
    backscatterCoeff.param = 11;
    backscatterCoeff.position = Math.round(+this.form.controls['backscatteringCoeff'].value * 100);
    ms.push(backscatterCoeff);

    const refractiveIndex = new MeasParamByPosition();
    refractiveIndex.param = 10;
    refractiveIndex.position = Math.round(+this.form.controls['refractiveIndex'].value * 10000);
    ms.push(refractiveIndex);

    const lmax = new MeasParamByPosition();
    lmax.param = 2;
    lmax.position = branch.distances.indexOf(this.ms.distance!);
    ms.push(lmax);
    const leaf = branch.distances[lmax.position].otherParams;

    const res = new MeasParamByPosition();
    res.param = 5;
    res.position = leaf.resolutions.indexOf(this.ms.resolution!);
    ms.push(res);

    const pulse = new MeasParamByPosition();
    pulse.param = 6;
    pulse.position = leaf.pulseDurations.indexOf(this.ms.pulse!);
    ms.push(pulse);

    const isTime = new MeasParamByPosition();
    isTime.param = 9;
    isTime.position = 1; // всегда
    ms.push(isTime);

    const time = new MeasParamByPosition();
    time.param = 8;
    time.position = leaf.periodsToAverage.indexOf(this.ms.averagingTime!);
    ms.push(time);

    return ms;
  }
}
