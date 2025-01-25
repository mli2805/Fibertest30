import { Component } from '@angular/core';
import { GisMapService } from '../../gis-map.service';

@Component({
  selector: 'rtu-trace-define',
  templateUrl: './trace-define.component.html',
  styleUrls: ['./trace-define.component.scss']
})
export class TraceDefineComponent {
  constructor(public gisMapService: GisMapService) {}
  onApply() {
    this.close();
  }

  onDiscard() {
    this.close();
  }

  close() {
    this.gisMapService.showTraceDefine.next(false);
  }
}
