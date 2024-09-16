import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplyMonitoringSettingsDto } from 'src/app/core/store/models/ft30/apply-monitorig-settings-dto';
import { FiberState, Frequency } from 'src/app/core/store/models/ft30/ft-enums';
import { PortWithTraceDto } from 'src/app/core/store/models/ft30/port-with-trace-dto';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';

@Component({
  selector: 'rtu-rtu-monitoring-settings',
  templateUrl: './rtu-monitoring-settings.component.html',
  styleUrls: ['./rtu-monitoring-settings.component.css']
})
export class RtuMonitoringSettingsComponent implements OnInit {
  rtuId!: string;
  rtu!: Rtu;

  store: Store<AppState> = inject(Store<AppState>);
  form!: FormGroup;

  frequencies: Frequency[] = Object.keys(Frequency)
    .filter((k) => !isNaN(Number(k)))
    .map((r) => {
      return +r;
    });

  oldSettings!: ApplyMonitoringSettingsDto;

  constructor(private route: ActivatedRoute) {
    this.oldSettings = new ApplyMonitoringSettingsDto();

    this.oldSettings.preciseMeas = Frequency.Every2Days;
    this.oldSettings.preciseSave = Frequency.Every6Hours;
    this.oldSettings.fastSave = Frequency.DoNot;
  }

  ngOnInit(): void {
    this.rtuId = this.route.snapshot.paramMap.get('id')!;
    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.rtuId))!;

    this.form = new FormGroup({
      preciseMeas: new FormControl(this.oldSettings.preciseMeas),
      preciseSave: new FormControl(this.oldSettings.preciseSave),
      fastSave: new FormControl(this.oldSettings.fastSave)
    });
  }

  onApplyClicked() {
    const dto = new ApplyMonitoringSettingsDto();
    dto.rtuId = this.rtu.rtuId;
    dto.rtuMaker = this.rtu.rtuMaker;
    dto.isMonitoringOn = true;

    dto.preciseMeas = Frequency.EveryHour;
    dto.preciseSave = Frequency.EveryDay;
    dto.fastSave = Frequency.DoNot;

    dto.ports = [];
    const trace = this.rtu.traces[0];
    const port1 = new PortWithTraceDto();
    port1.traceId = trace.traceId;
    port1.portOfOtau = trace.port!;
    port1.lastTraceState = FiberState.Unknown;
    port1.lastRtuAccidentOnTrace = ReturnCode.MeasurementEndedNormally;
    dto.ports.push(port1);

    this.store.dispatch(RtuMgmtActions.applyMonitoringSettings({ dto }));
  }

  // если только посмотреть
  isDisabled(): boolean {
    return false;
  }
}
