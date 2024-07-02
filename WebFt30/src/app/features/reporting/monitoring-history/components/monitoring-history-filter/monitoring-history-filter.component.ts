import { Component, EventEmitter, Output } from '@angular/core';
import { OtauPortPath } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-monitoring-history-filter',
  templateUrl: './monitoring-history-filter.component.html',
  styleUrls: ['./monitoring-history-filter.component.css']
})
export class MonitoringHistoryFilterComponent {
  @Output() public filterChanged = new EventEmitter<any>();

  onSelectedPortsChanged(selectedPorts: OtauPortPath[]) {
    const data = { selectedPorts: selectedPorts, selectedPeriod: null };
    this.filterChanged.emit(data);
  }

  onSelectedPeriodChanged(selectedPeriod: any) {
    const data = { selectedPorts: null, selectedPeriod: selectedPeriod };
    this.filterChanged.emit(data);
  }
}
