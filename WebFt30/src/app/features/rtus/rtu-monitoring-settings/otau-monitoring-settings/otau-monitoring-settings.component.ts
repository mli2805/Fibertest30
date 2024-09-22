import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Trace } from 'src/app/core/store/models/ft30/trace';

@Component({
  selector: 'rtu-otau-monitoring-settings',
  templateUrl: './otau-monitoring-settings.component.html'
})
export class OtauMonitoringSettingsComponent {
  _traces!: (Trace | null)[];
  @Input() set traces(value: (Trace | null)[]) {
    this._traces = value;
  }

  @Output() portChecked = new EventEmitter<number>();

  bopMonitoringTime = 0;
  copyTraces!: { isOn: boolean; fastDuration: number }[];

  onPortCheckBoxClicked(i: number) {
    // не хочет менять свойство трассы к которому прицеплен слайдер
    // пишет read only property
    // поэтому копируем трассу саму в себя, после этого разрешает менять свойство
    this._traces[i] = { ...this._traces[i]! };
    this._traces[i]!.isIncludedInMonitoringCycle = !this._traces[i]!.isIncludedInMonitoringCycle;

    const sec = this._traces[i]!.isIncludedInMonitoringCycle
      ? this._traces[i]!.fastDuration
      : -this._traces[i]!.fastDuration;
    this.portChecked.emit(sec);
  }
}
