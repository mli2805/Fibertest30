import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';

@Component({
  selector: 'rtu-gis-viewer',
  templateUrl: './gis-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GisMapService],
  styles: [':host { width: 100%; height: 100%; }']
})
export class GisViewerComponent extends OnDestroyBase implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(private gisMapService: GisMapService, private gisService: GisService) {
    super();
  }

  async ngOnInit() {
    try {
      await this.loadRoutesData();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // может применяться для read-only пользователей
  async loadRoutesData() {
    this.loading.next(true);
    const response = await firstValueFrom(this.gisService.getGraphRoutes());
    const graphData = GisMapping.fromGrpcGraphRoutesData(response.data!);
    // console.log(graphData);

    // const sum = graphData.routes
    //   .map((r) => r.nodes.length)
    //   .reduce((acc, value) => {
    //     return acc + value;
    //   }, 0);
    // console.log(`${sum} nodes`);

    this.gisMapService.setGraphRoutesData(graphData);
    this.loading.next(false);
  }
}
