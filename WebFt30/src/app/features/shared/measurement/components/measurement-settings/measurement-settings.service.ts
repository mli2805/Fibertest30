import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { ConvertUtils } from 'src/app/core/convert.utils';
import {
  DistanceRange,
  LaserUnit,
  MeasurementSettings,
  OtdrMeasurementParameters
} from 'src/app/core/store/models';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { DefaultParameters } from 'src/app/shared/utils/default-parameters';
import { ValidationUtils } from 'src/app/shared/utils/validation-utils';
import { NetworkType } from 'src/grpc-generated';

interface NetworkTypeViewModel {
  networkType: NetworkType;
  nameId: string;
}

interface SplitterViewModel {
  count: number;
  minIncluding: number;
  maxExcluding: number;
}

@Injectable()
export class MeasurementSettignsService extends OnDestroyBase {
  private suspendUpdateMeasurementSettingsAndAutoSetThresholds = false;
  private measurementSettingsChanged = new BehaviorSubject<MeasurementSettings | null>(null);
  private measurementSettingsSetExternally = new BehaviorSubject<null>(null);

  get measurementSettings$(): Observable<MeasurementSettings | null> {
    return this.measurementSettingsChanged.asObservable();
  }

  get measurementSettingsSetExternally$(): Observable<null> {
    return this.measurementSettingsSetExternally.asObservable();
  }

  setSupportedMeasurementParameters(supportedMeasurementParameters: OtdrMeasurementParameters) {
    this.validateMeasurementParameters(supportedMeasurementParameters);
    this.lasers = supportedMeasurementParameters.laserUnits;
    this.setLaser(this.lasers[0]);
  }

  private previousSettings: MeasurementSettings | null = null;

  form!: FormGroup;

  autoMode = false;
  fastMeasurement = false;
  frontPanelCheck = false;

  networkTypes: NetworkTypeViewModel[] = [
    {
      networkType: NetworkType.PointToPoint,
      nameId: ConvertUtils.networkTypeToString(NetworkType.PointToPoint)
    },
    {
      networkType: NetworkType.ManualPON,
      nameId: ConvertUtils.networkTypeToString(NetworkType.ManualPON)
    },
    {
      networkType: NetworkType.AutoPON,
      nameId: ConvertUtils.networkTypeToString(NetworkType.AutoPON)
    },
    { networkType: NetworkType.xWDM, nameId: ConvertUtils.networkTypeToString(NetworkType.xWDM) },
    {
      networkType: NetworkType.AutoPonToOnt,
      nameId: ConvertUtils.networkTypeToString(NetworkType.AutoPonToOnt)
    }
  ];

  selectedNetworkType = this.networkTypes[0];

  lasers!: LaserUnit[];
  selectedLaser!: LaserUnit;

  distanceRanges!: DistanceRange[];
  selectedDistanceRange: DistanceRange | null = null;

  averagingTimes!: string[];
  selectedAveragingTime: string | null = null;

  pulses!: string[];
  selectedPulse: string | null = null;

  samplingResolutions!: string[];
  selectedSamplingResolution: string | null = null;

  muxs = [1, 2, 3, 4, 5];
  selectedMux = this.muxs[0];

  splitters: SplitterViewModel[] = [
    null!,
    { count: 2, minIncluding: 3.0, maxExcluding: 4.5 },
    { count: 4, minIncluding: 6.0, maxExcluding: 8.1 },
    { count: 8, minIncluding: 9.0, maxExcluding: 11.7 },
    { count: 16, minIncluding: 12.0, maxExcluding: 15.3 },
    { count: 32, minIncluding: 15.3, maxExcluding: 18.3 },
    { count: 64, minIncluding: 18.3, maxExcluding: 19.5 },
    { count: 128, minIncluding: 21.3, maxExcluding: 24.5 }
  ];

  selectedSplitter1: SplitterViewModel | null = this.splitters[5];
  selectedSplitter2: SplitterViewModel | null = null;

  get showSplitters(): boolean {
    return this.selectedNetworkType.networkType === NetworkType.ManualPON;
  }

  get showMux(): boolean {
    return this.selectedNetworkType.networkType === NetworkType.xWDM;
  }

  get isValid(): boolean {
    if (this.autoMode) {
      return (
        this.form.controls['eventLossThreshold'].valid &&
        this.form.controls['eventReflectanceThreshold'].valid &&
        this.form.controls['endOfFiberThreshold'].valid
      );
    }

    return (
      this.form.valid &&
      this.selectedLaser !== null &&
      this.selectedDistanceRange !== null &&
      this.selectedAveragingTime !== null &&
      this.selectedSamplingResolution !== null &&
      this.selectedPulse !== null
    );
  }

  constructor(private formBuilder: FormBuilder) {
    super();

    this.form = this.formBuilder.group({
      refractiveIndex: [
        DefaultParameters.RefractiveIndex,
        [
          Validators.required,
          Validators.min(DefaultParameters.RefractiveIndexMin),
          Validators.max(DefaultParameters.RefractiveIndexMax),
          Validators.pattern(ValidationUtils.FloatPattern)
        ]
      ],
      backscatteringCoeff: [
        DefaultParameters.BackscatteringCoeff,
        [
          Validators.required,
          Validators.min(DefaultParameters.BackscatteringCoeffMin),
          Validators.max(DefaultParameters.BackscatteringCoeffMax),
          Validators.pattern(ValidationUtils.FloatPattern)
        ]
      ],
      eventLossThreshold: [
        DefaultParameters.EventLossThreshold,
        [
          Validators.required,
          Validators.min(DefaultParameters.EventLossThresholdMin),
          Validators.max(DefaultParameters.EventLossThresholdMax),
          Validators.pattern(ValidationUtils.FloatPattern)
        ]
      ],
      eventReflectanceThreshold: [
        DefaultParameters.EventReflectanceThreshold,
        [
          Validators.required,
          Validators.min(DefaultParameters.EventReflectanceThresholdMin),
          Validators.max(DefaultParameters.EventReflectanceThresholdMax),
          Validators.pattern(ValidationUtils.FloatPattern)
        ]
      ],
      endOfFiberThreshold: [
        DefaultParameters.EndOfFiberThreshold,
        [
          Validators.required,
          Validators.min(DefaultParameters.EndOfFiberThresholdMin),
          Validators.max(DefaultParameters.EndOfFiberThresholdMax),
          Validators.pattern(ValidationUtils.FloatPattern)
        ]
      ]
    });

    this.form.statusChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe((status) => {
      this.updateMeasurementSettings();
    });
    this.form.valueChanges.pipe(takeUntil(this.ngDestroyed$)).subscribe((values) => {
      this.updateMeasurementSettings();
    });
  }

  setMeasurementSettings(measurementSettings: MeasurementSettings) {
    this.suspendUpdateMeasurementSettingsAndAutoSetThresholds = true;
    try {
      this.doSetMeasurementSettings(measurementSettings);
      this.suspendUpdateMeasurementSettingsAndAutoSetThresholds = false;
      this.updateMeasurementSettings();
      this.measurementSettingsSetExternally.next(null);
    } finally {
      this.suspendUpdateMeasurementSettingsAndAutoSetThresholds = false;
    }
  }

  private doSetMeasurementSettings(measurementSettings: MeasurementSettings) {
    const networkType = this.networkTypes.find(
      (x) => x.networkType === measurementSettings.networkType
    );
    if (!networkType) {
      return;
    }
    this.setNetworkType(networkType);
    this.setAutoMode(measurementSettings.autoMode);

    const laser = this.lasers.find((x) => x.name === measurementSettings.laser);
    if (!laser) {
      return;
    }
    this.setLaser(laser);

    const distanceRange = laser.distanceRanges.find(
      (x) => x.name === measurementSettings.distanceRange
    );
    if (!distanceRange) {
      return;
    }
    this.setDistanceRange(distanceRange);
    this.setFastMeasurement(measurementSettings.fastMeasurement);
    this.setAveragingTime(measurementSettings.averagingTime);
    this.setPulse(measurementSettings.pulse);
    this.setSamplingResolution(measurementSettings.samplingResolution);

    this.setFrontPanelCheck(measurementSettings.frontPanelCheck);

    this.form.controls['refractiveIndex'].setValue(measurementSettings.refractiveIndex);
    this.form.controls['backscatteringCoeff'].setValue(measurementSettings.backscatteringCoeff);
    this.form.controls['eventLossThreshold'].setValue(measurementSettings.eventLossThreshold);
    this.form.controls['eventReflectanceThreshold'].setValue(
      measurementSettings.eventReflectanceThreshold
    );
    this.form.controls['endOfFiberThreshold'].setValue(measurementSettings.endOfFiberThreshold);

    if (this.showMux) {
      this.setMux(measurementSettings.mux);
    }

    if (this.showSplitters) {
      const splitter1 = this.splitters.find(
        (s) => this.calcSplitterDbs(s) === measurementSettings.splitter1dB
      );
      if (splitter1) {
        this.setSplitter1(splitter1);
      }

      const splitter2 = this.splitters.find(
        (s) => this.calcSplitterDbs(s) === measurementSettings.splitter2dB
      );
      if (splitter2) {
        this.setSplitter2(splitter2);
      }
    }
  }

  isInvalidAndTouched(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  setAutoMode(autoMode: boolean) {
    this.autoMode = autoMode;
    this.updateMeasurementSettings();
  }

  setFastMeasurement(fastMeasurement: boolean) {
    this.fastMeasurement = fastMeasurement;
    this.updateAveragingTimes();
    this.updateMeasurementSettings();
  }

  setFrontPanelCheck(frontPanelCheck: boolean) {
    this.frontPanelCheck = frontPanelCheck;
    this.updateMeasurementSettings();
  }

  setNetworkType(networType: NetworkTypeViewModel) {
    this.selectedNetworkType = networType;
    this.tryUpdateThresholds();
    this.updateMeasurementSettings();
  }

  setLaser(laser: LaserUnit) {
    this.selectedLaser = laser;
    this.distanceRanges =
      laser && laser.distanceRanges
        ? [...laser.distanceRanges].sort((a: DistanceRange, b: DistanceRange) => +a.name - +b.name)
        : [];
    this.setDistanceRange(this.distanceRanges.length > 0 ? this.distanceRanges[0] : null);

    this.updateMeasurementSettings();
  }

  setDistanceRange(distanceRange: DistanceRange | null) {
    this.selectedDistanceRange = distanceRange;

    this.updateAveragingTimes();

    this.pulses = distanceRange && distanceRange.pulseDurations ? distanceRange.pulseDurations : [];
    this.setPulse(this.pulses.length > 0 ? this.pulses[0] : null);

    this.samplingResolutions =
      distanceRange && distanceRange.resolutions ? distanceRange.resolutions : [];
    this.setSamplingResolution(
      this.samplingResolutions.length > 0 ? this.samplingResolutions[0] : null
    );

    this.updateMeasurementSettings();
  }

  updateAveragingTimes() {
    if (this.selectedDistanceRange) {
      this.averagingTimes = this.fastMeasurement
        ? this.selectedDistanceRange.liveAveragingTimes
        : this.selectedDistanceRange.averagingTimes;
      this.setAveragingTime(null);
    } else {
      this.averagingTimes = [];
    }

    this.setAveragingTime(this.averagingTimes.length > 0 ? this.averagingTimes[0] : null);
    this.updateMeasurementSettings();
  }

  setAveragingTime(time: string | null) {
    this.selectedAveragingTime = time;
    this.updateMeasurementSettings();
  }

  setPulse(pulse: string | null) {
    this.selectedPulse = pulse;
    this.updateMeasurementSettings();
  }

  setSamplingResolution(samplingResolution: string | null) {
    this.selectedSamplingResolution = samplingResolution;
    this.updateMeasurementSettings();
  }

  setMux(mux: number) {
    this.selectedMux = mux;
    this.tryUpdateThresholds();
    this.updateMeasurementSettings();
  }

  setSplitter1(splitter: SplitterViewModel | null) {
    this.selectedSplitter1 = splitter;
    this.tryUpdateThresholds();
    this.updateMeasurementSettings();
  }

  setSplitter2(splitter: SplitterViewModel | null) {
    this.selectedSplitter2 = splitter;
    this.tryUpdateThresholds();
    this.updateMeasurementSettings();
  }

  splitterToString(splitter: SplitterViewModel | null): string {
    if (splitter === null) {
      return '--';
    }
    return `1x${splitter.count}`;
  }

  private validateMeasurementParameters(parameters: OtdrMeasurementParameters) {
    if (!parameters) {
      throw new Error('OtdrMeasurementParameters must exist');
    }

    if (!parameters.laserUnits || parameters.laserUnits.length === 0) {
      throw new Error('at least one laserUnits is required');
    }
  }

  private updateMeasurementSettings() {
    if (this.suspendUpdateMeasurementSettingsAndAutoSetThresholds) {
      return;
    }

    const measurementSettings: MeasurementSettings = {
      isValid: this.isValid,
      autoMode: this.autoMode,
      networkType: this.selectedNetworkType.networkType,
      fastMeasurement: this.fastMeasurement,
      frontPanelCheck: this.frontPanelCheck,
      laser: this.selectedLaser?.name ?? null,
      distanceRange: this.selectedDistanceRange?.name ?? null,
      averagingTime: this.selectedAveragingTime,
      pulse: this.selectedPulse,
      samplingResolution: this.selectedSamplingResolution,
      refractiveIndex: this.form.controls['refractiveIndex'].value,
      backscatteringCoeff: this.form.controls['backscatteringCoeff'].value,
      eventLossThreshold: this.form.controls['eventLossThreshold'].value,
      eventReflectanceThreshold: this.form.controls['eventReflectanceThreshold'].value,
      endOfFiberThreshold: this.form.controls['endOfFiberThreshold'].value,
      splitter1dB: this.calcSplitterDbs(this.selectedSplitter1),
      splitter2dB: this.calcSplitterDbs(this.selectedSplitter2),
      mux: this.selectedMux
    };

    if (
      !this.previousSettings ||
      JSON.stringify(this.previousSettings) !== JSON.stringify(measurementSettings)
    ) {
      this.measurementSettingsChanged.next(measurementSettings);
      this.previousSettings = measurementSettings;
    }
  }

  private tryUpdateThresholds() {
    if (this.suspendUpdateMeasurementSettingsAndAutoSetThresholds) {
      return;
    }

    const s1 = this.calcSplitterDbs(this.selectedSplitter1);
    const s2 = this.calcSplitterDbs(this.selectedSplitter2);

    let eventLossThreshold = DefaultParameters.EventLossThreshold;
    if (this.selectedNetworkType.networkType === NetworkType.ManualPON) {
      if (s1 + s2 !== 0) {
        eventLossThreshold = s1 + s2;
      }
    }

    let endOfFiberThreshold = DefaultParameters.EndOfFiberThreshold;
    if (this.selectedNetworkType.networkType === NetworkType.xWDM) {
      endOfFiberThreshold = this.selectedMux * 3 + 3;
    }
    if (this.selectedNetworkType.networkType === NetworkType.ManualPON) {
      if (s2 !== 0) {
        endOfFiberThreshold = s1 + s2 + 3;
      }
    }

    this.form.controls['eventLossThreshold'].setValue(
      Math.min(
        Math.max(eventLossThreshold, DefaultParameters.EventLossThresholdMin),
        DefaultParameters.EventLossThresholdMax
      )
    );
    this.form.controls['endOfFiberThreshold'].setValue(
      Math.min(
        Math.max(endOfFiberThreshold, DefaultParameters.EndOfFiberThresholdMax),
        DefaultParameters.EndOfFiberThresholdMin
      )
    );
  }

  private calcSplitterDbs(splitter: SplitterViewModel | null): number {
    if (!splitter) {
      return 0;
    }
    return (splitter.minIncluding + splitter.maxExcluding) / 2;
  }
}
