import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { firstValueFrom } from 'rxjs';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';

@Component({
  selector: 'rtu-gis-viewer',
  templateUrl: './gis-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GisMapService],
  styles: [':host { width: 100%; height: 100%; }']
})
export class GisViewerComponent extends OnDestroyBase implements OnInit {
  constructor(private gisMapService: GisMapService, private gisService: GisService) {
    super();
  }

  async ngOnInit() {
    try {
      const response = await firstValueFrom(this.gisService.getGraphRoutes());
      const graphData = GisMapping.fromGrpcGraphRoutesData(response.data!);
      console.log(graphData);
      this.gisMapService.setGraphRoutesData(graphData);
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
