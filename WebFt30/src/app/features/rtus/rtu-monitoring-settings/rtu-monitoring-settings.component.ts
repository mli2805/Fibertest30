import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { ApplyMonitoringSettingsDto } from 'src/app/core/store/models/ft30/apply-monitorig-settings-dto';
import { Frequency, MonitoringState } from 'src/app/core/store/models/ft30/ft-enums';
import { PortWithTraceDto } from 'src/app/core/store/models/ft30/port-with-trace-dto';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { SecUtil } from './sec-util';
import { RtuMgmtSelectors } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.selectors';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';

interface IOtau {
  title: string;
  traces: (Trace | null)[];
}

@Component({
  selector: 'rtu-rtu-monitoring-settings',
  templateUrl: './rtu-monitoring-settings.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class RtuMonitoringSettingsComponent extends OnDestroyBase implements OnInit {
  rtuMgmtActions = RtuMgmtActions;

  otaus: IOtau[] = [];
  selectedOtau!: IOtau;
  traces$ = new BehaviorSubject<(Trace | null)[] | null>(null);

  store: Store<AppState> = inject(Store<AppState>);
  form!: FormGroup;

  frequencies: Frequency[] = Object.keys(Frequency)
    .filter((k) => !isNaN(Number(k)))
    .map((r) => {
      return +r;
    });

  onlyPerm: string[] = ['i18n.ft.permanently'];
  onlyPermSele = 'i18n.ft.permanently';

  cycleFullTime = '0:00';
  cycleFullTimeSec = 0;

  inProgress$ = this.store.select(RtuMgmtSelectors.selectRtuOperationInProgress);
  operationSuccess$ = this.store.select(RtuMgmtSelectors.selectRtuOperationSuccess);
  errorMessageId$ = this.store.select(RtuMgmtSelectors.selectErrorMessageId);

  rtu!: Rtu;
  rtu$;

  constructor(private route: ActivatedRoute) {
    super();

    const rtuId = this.route.snapshot.paramMap.get('id')!;
    // подписка на рту. если подписаться пока rtuId не определен ничего не получишь
    this.rtu$ = this.store.select(RtuTreeSelectors.selectRtu(rtuId));
  }

  ngOnInit(): void {
    // еще одна подписка на рту, так я могу запустить свою функции, когда поменялся рту (при старте и при перечитывании)
    // в данном случае нужно обновить переменные для темплейта (которые не rtu.XXX, а трассы переключателей)
    this.rtu$.pipe(takeUntil(this.ngDestroyed$)).subscribe((rtu) => this.updateView(rtu));
  }

  updateView(rtu: Rtu | null) {
    if (!rtu) return;
    this.rtu = rtu;
    this.initializeControls();
  }

  initializeControls() {
    this.collectOtausWithTraces();
    this.selectedOtauChanged(this.otaus[0]);

    for (let i = 0; i < this.otaus.length; i++) {
      this.cycleFullTimeSec =
        this.cycleFullTimeSec +
        this.otaus[i].traces
          .filter((t) => t && t.isIncludedInMonitoringCycle)
          .map((d) => d!.fastDuration)
          .reduce((a, b) => a + b);
    }
    this.cycleFullTime = SecUtil.secToString(this.cycleFullTimeSec);

    this.form = new FormGroup({
      preciseMeas: new FormControl(this.rtu.preciseMeas),
      preciseSave: new FormControl(this.rtu.preciseSave),
      fastMeas: new FormControl(this.onlyPermSele),
      fastSave: new FormControl(this.rtu.fastSave),
      isMonitoringOn: new FormControl(this.rtu.monitoringMode === MonitoringState.On)
    });
  }

  collectOtausWithTraces() {
    // главный OTAU с трассами
    const traces = Array(this.rtu.ownPortCount).fill(null);
    this.otaus = []; // clean every time
    for (let i = 0; i < this.rtu.traces.length; i++) {
      const trace = this.rtu.traces[i];
      if (trace.isAttached && trace.port!.isPortOnMainCharon) {
        traces[trace.port!.opticalPort - 1] = trace;
      }
    }
    this.otaus.push({ title: this.rtu.title, traces: traces });

    // всех БОПы с трассами
    for (let index = 0; index < this.rtu.bops.length; index++) {
      const bop = this.rtu.bops[index];
      const traces = Array(bop.portCount).fill(null);
      for (let i = 0; i < bop.traces.length; i++) {
        const trace = bop.traces[i];
        traces[trace.port!.opticalPort - 1] = trace;
      }
      this.otaus.push({ title: bop.bopNetAddress.toString(), traces: traces });
    }
  }

  selectedOtauChanged(otau: IOtau) {
    this.traces$.next(null);
    this.selectedOtau = otau;
    this.traces$.next(this.selectedOtau.traces);
  }

  onPortChecked(sec: number) {
    this.cycleFullTimeSec = this.cycleFullTimeSec + sec;
    this.cycleFullTime = SecUtil.secToString(this.cycleFullTimeSec);
  }

  onApplyClicked() {
    const dto = this.collectDto();

    this.store.dispatch(RtuMgmtActions.applyMonitoringSettings({ dto }));
  }

  collectDto(): ApplyMonitoringSettingsDto {
    const dto = new ApplyMonitoringSettingsDto();
    dto.rtuId = this.rtu.rtuId;
    dto.rtuMaker = this.rtu.rtuMaker;
    dto.isMonitoringOn = this.form.controls['isMonitoringOn'].value;

    dto.preciseMeas = this.form.controls['preciseMeas'].value;
    dto.preciseSave = this.form.controls['preciseSave'].value;
    dto.fastSave = this.form.controls['fastSave'].value;

    dto.ports = this.otaus
      .map((o) => o.traces)
      .flat()
      .filter((t) => t && t.isIncludedInMonitoringCycle)
      .map((a) => this.toPortWithTraceDto(a!));

    return dto;
  }

  toPortWithTraceDto(trace: Trace): PortWithTraceDto {
    const port = new PortWithTraceDto();
    port.traceId = trace.traceId;
    port.portOfOtau = trace.port!;
    port.lastTraceState = trace.state;
    port.lastRtuAccidentOnTrace = ReturnCode.MeasurementEndedNormally;
    return port;
  }

  // если только посмотреть
  isDisabled(): boolean {
    return false;
  }
}
