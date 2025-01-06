import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';
import { firstValueFrom } from 'rxjs';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';

@Component({
  selector: 'rtu-gis-trace-viewer',
  templateUrl: './gis-trace-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GisMapService],
  styles: [':host { width: 100%; height: 100%; }']
})
export class GisTraceViewerComponent extends OnDestroyBase implements OnInit {
  private _optivalEvent!: OpticalEvent;
  @Input() set opticalEvent(value: OpticalEvent) {
    this._optivalEvent = value;
  }

  constructor(
    private store: Store<AppState>,
    private gisMapService: GisMapService,
    private gisService: GisService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  async ngOnInit() {
    try {
      const response = await firstValueFrom(
        this.gisService.getTraceRoute(this._optivalEvent.traceId)
      );
      const routeData = GisMapping.fromTraceRouteData(response.routeData!);
      console.log(routeData);
      this.gisMapService.setRouteData(routeData);
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
