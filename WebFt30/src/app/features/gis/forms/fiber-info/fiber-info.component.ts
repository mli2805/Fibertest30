import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AppState, AuthSelectors } from 'src/app/core';
import { GisMapService } from '../../gis-map.service';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { FiberInfo, OpticalLength } from 'src/app/core/store/models/ft30/geo-data';
import { CoreUtils } from 'src/app/core/core.utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationUtils } from 'src/app/shared/utils/validation-utils';
import { GraphService } from 'src/app/core/grpc';

interface OpticalLengthModel {
  trace: string;
  length: string;
}

interface FiberInfoModel {
  node1: string;
  node2: string;
  gpsLength: string;
  userInputedLength: number;
  tracesThrough: OpticalLengthModel[];
  hasTraceUnderMonitoring: boolean;
}

@Component({
  selector: 'rtu-fiber-info',
  templateUrl: './fiber-info.component.html'
})
export class FiberInfoComponent implements OnInit {
  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  public store: Store<AppState> = inject(Store);
  private hasEditGraphPermission = CoreUtils.getCurrentState(
    this.store,
    AuthSelectors.selectHasEditGraphPermission
  );

  form!: FormGroup;
  fiberId!: string;
  fromLandmarks!: boolean;
  fiberInfoModel = new BehaviorSubject<FiberInfoModel | null>(null);
  model$ = this.fiberInfoModel.asObservable();

  constructor(
    private gisMapService: GisMapService,
    private gisService: GisService,
    private graphService: GraphService
  ) {}

  async ngOnInit(): Promise<void> {
    this.fiberId = this.gisMapService.showSectionInfoDialog.value!;
    this.fromLandmarks = this.gisMapService.showSectionInfoFromLandmarks;

    this.spinning.next(true);
    const response = await firstValueFrom(this.gisService.getFiberInfo(this.fiberId));
    this.spinning.next(false);
    if (response === null) this.close();

    this.form = new FormGroup({
      userInputLength: new FormControl(response.fiberInfo!.userInputedLength, [
        Validators.pattern(ValidationUtils.NonNegativeInteger),
        Validators.min(0),
        Validators.max(9999)
      ])
    });

    this.fiberInfoModel.next(this.toModel(response.fiberInfo!));
  }

  isInputDisabled() {
    return (
      !this.hasEditGraphPermission ||
      this.fiberInfoModel.value!.hasTraceUnderMonitoring ||
      this.fromLandmarks
    );
  }

  isUserLengthInvalid() {
    const control = this.form.controls['userInputLength'];

    return control.invalid && (control.dirty || control.touched);
  }

  toModel(fiberInfo: FiberInfo): FiberInfoModel {
    return {
      node1: fiberInfo.leftNodeTitle,
      node2: fiberInfo.rightNodeTitle,
      gpsLength: fiberInfo.gpsLength.toFixed(0),
      userInputedLength: fiberInfo.userInputedLength,
      tracesThrough: fiberInfo.tracesThrough.map((t) => this.toOpticalLengthModel(t)),
      hasTraceUnderMonitoring: fiberInfo.hasTraceUnderMonitoring
    };
  }

  toOpticalLengthModel(opticalLength: OpticalLength): OpticalLengthModel {
    const trace = this.gisMapService
      .getGeoData()
      .traces.find((t) => t.id === opticalLength.traceId);
    return {
      trace: trace!.title,
      length: opticalLength.length === 0 ? 'i18n.ft.no-base' : opticalLength.length.toFixed(0)
    };
  }

  isApplyDisabled() {
    if (this.form.pristine) return true;
    return !this.form.valid;
  }

  isDiscardDisabled() {
    if (this.form.pristine) return true;
    return false;
  }

  async onApplyClicked() {
    const command = {
      Id: this.fiberId,
      UserInputedLength: +this.form.controls['userInputLength'].value
    };
    const json = JSON.stringify(command);

    const response = await firstValueFrom(this.graphService.sendCommand(json, 'UpdateFiber'));
    this.close();
  }

  onDiscardClicked() {
    this.close();
  }
  close() {
    this.gisMapService.setShowSectionInfoDialog(null);
  }
}
