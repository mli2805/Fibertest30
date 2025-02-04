import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from 'src/app/core';
import { GisMapService } from '../gis-map.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { CoreUtils } from 'src/app/core/core.utils';

@Component({
  selector: 'rtu-gis',
  templateUrl: 'gis.component.html',
  styles: [':host { display: flex; flex-grow: 1; }']
})
export class GisComponent extends OnDestroyBase implements OnInit {
  public store: Store<AppState> = inject(Store);
  hasEditPermission$ = this.store.select(AuthSelectors.selectHasEditGraphPermission);
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(public gisMapService: GisMapService, private gisService: GisService) {
    super();
  }

  async ngOnInit() {
    try {
      const hasEditPermission = CoreUtils.getCurrentState(
        this.store,
        AuthSelectors.selectHasEditGraphPermission
      );

      if (hasEditPermission) {
        await this.loadAllGeoData();
      } else {
        await this.loadRoutesData();
      }
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

  // может применяться для read-only пользователей
  async loadRoutesData() {
    this.loading.next(true);
    const response = await firstValueFrom(this.gisService.getGraphRoutes());
    const graphData = GisMapping.fromGrpcGraphRoutesData(response.data!);

    this.gisMapService.setGraphRoutesData(graphData);
    this.loading.next(false);
  }
}
