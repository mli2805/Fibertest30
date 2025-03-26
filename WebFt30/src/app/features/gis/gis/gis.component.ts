import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, SettingsActions, SettingsSelectors } from 'src/app/core';
import { GisMapService } from '../gis-map.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { CoreUtils } from 'src/app/core/core.utils';

interface MapSource {
  id: number;
  str: string;
}

@Component({
  selector: 'rtu-gis',
  templateUrl: 'gis.component.html',
  styles: [':host { display: flex; flex-grow: 1; }']
})
export class GisComponent extends OnDestroyBase implements OnInit, AfterViewInit {
  @ViewChild('myDiv') myDiv!: ElementRef;
  mapHeight!: number; // примерная высота карты в пикселях

  public store: Store<AppState> = inject(Store);
  hasEditPermission$ = this.store.select(AuthSelectors.selectHasEditGraphPermission);
  loading$ = this.gisMapService.geoDataLoading.asObservable();

  // это про зум с которого начинать показывать узлы
  zooms!: number[];
  selectedZoom!: number;

  mapSources!: MapSource[];
  selectedMapSource!: MapSource;

  constructor(public gisMapService: GisMapService, private gisService: GisService) {
    super();

    this.zooms = Array.from({ length: 21 }, (_, i) => i + 1);
    this.mapSources = new Array(0);
    this.mapSources.push({ id: 0, str: 'OpenStreetMap' });
    this.mapSources.push({ id: 1, str: 'GoogleStreets' });
    this.mapSources.push({ id: 2, str: 'GoogleHybrid' });
    // this.mapSources.push({ id: 3, str: 'GoogleSatellite' });
    // this.mapSources.push({ id: 4, str: 'GoogleTerrain' });
  }

  ngAfterViewInit(): void {
    const element = this.myDiv.nativeElement;
    this.mapHeight = element.offsetHeight;
  }

  async ngOnInit() {
    try {
      const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
      this.gisMapService.currentZoom.next(userSettings.zoom);
      // комбик зума для показа узлов
      this.selectedZoom = userSettings.showNodesFromZoom;
      this.gisMapService.setShowNodesFromZoom(userSettings.showNodesFromZoom);
      //
      const mapSource = this.mapSources.find((f) => f.id === userSettings.sourceMapId)!;
      this.selectedMapSource = mapSource;
      this.gisMapService.mapSourceId.next(mapSource.id);

      // сервер определит полномочия пользователя и выдаст соотв данные
      // а здесь в зависимости от пермишенов будут созданы контекстные меню
      await this.loadAllGeoData();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  // для рута содержит узлы/участки не входящие в трассы
  // для остальных только готовые трассы
  async loadAllGeoData() {
    this.gisMapService.geoDataLoading.next(true);
    const response = await firstValueFrom(this.gisService.getAllGeoData());
    const geoData = GisMapping.fromGrpcGeoData(response.data!);

    this.gisMapService.setGeoData(geoData);
    this.gisMapService.geoDataLoading.next(false);
  }

  // это про зум с которого начинать показывать узлы
  onZoomChanged($event: any) {
    this.gisMapService.setShowNodesFromZoom($event);
    this.store.dispatch(SettingsActions.changeShowNodesFromZoom({ zoom: $event }));
  }

  onMapSourceChanged($event: any) {
    this.gisMapService.mapSourceId.next($event.id);
    this.store.dispatch(SettingsActions.changeSourceMapId({ id: $event.id }));
  }
}
