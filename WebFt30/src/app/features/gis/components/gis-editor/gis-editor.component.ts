import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { firstValueFrom } from 'rxjs';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';

@Component({
  selector: 'rtu-gis-editor',
  templateUrl: './gis-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GisMapService],
  styles: [':host { width: 100%; height: 100%; }']
})
export class GisEditorComponent extends OnDestroyBase implements OnInit {
  constructor(private gisMapService: GisMapService, private gisService: GisService) {
    super();
  }

  async ngOnInit() {
    try {
      await this.loadAllGeoData();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // для рута. содержит узлы/участки не входящие в трассы
  async loadAllGeoData() {
    const response = await firstValueFrom(this.gisService.getAllGeoData());
    const geoData = GisMapping.fromGrpcGeoData(response.data!);
    // console.log(geoData);
    // console.log(`nodes: ${geoData.nodes.length}  fibers: ${geoData.fibers.length}`);

    this.gisMapService.setGeoData(geoData);
  }
}
