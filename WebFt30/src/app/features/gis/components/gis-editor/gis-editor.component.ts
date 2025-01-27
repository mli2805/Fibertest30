import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';

@Component({
  selector: 'rtu-gis-editor',
  templateUrl: './gis-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { width: 100%; height: 100%; }']
})
export class GisEditorComponent extends OnDestroyBase implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(public gisMapService: GisMapService, private gisService: GisService) {
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
    this.loading.next(true);
    const response = await firstValueFrom(this.gisService.getAllGeoData());
    const geoData = GisMapping.fromGrpcGeoData(response.data!);

    this.gisMapService.setGeoData(geoData);
    this.loading.next(false);
  }
}
