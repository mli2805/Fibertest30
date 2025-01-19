import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-contextmenu';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom, takeUntil } from 'rxjs';
import { GisIconWithZIndex, GisMapIcons } from '../shared/gis-map-icons';
import { LeafletAngularPopupBinder } from '../shared/leaflet-angular-popup-binder';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { EquipmentType } from 'src/grpc-generated';
import { AllGeoData, GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { ColorUtils } from 'src/app/shared/utils/color-utils';
import { GisMapUtils } from '../shared/gis-map.utils';
import { GisMapService } from '../../gis-map.service';
import { GisMapLayer } from '../../models/gis-map-layer';
import { CoreUtils } from 'src/app/core/core.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsActions, SettingsSelectors } from 'src/app/core';
import { GraphService } from 'src/app/core/grpc';

@Component({
  selector: 'rtu-gis-editor-map',
  templateUrl: './gis-editor-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class GisEditorMapComponent extends OnDestroyBase implements OnInit, OnDestroy {
  private store: Store<AppState> = inject(Store<AppState>);
  private map!: L.Map;
  private icons = new GisMapIcons();
  private layerGroups: Map<GisMapLayer, L.FeatureGroup> = new Map();

  private popupBinder!: LeafletAngularPopupBinder;

  currentZoom = new BehaviorSubject<number>(16);
  currentZoom$ = this.currentZoom.asObservable();

  mousePosition = new BehaviorSubject<string>('');
  mousePosition$ = this.mousePosition.asObservable();

  constructor(
    private gisMapService: GisMapService,
    private graphService: GraphService,
    private ts: TranslateService,
    appRef: ApplicationRef,
    envInjector: EnvironmentInjector
  ) {
    super();
    this.popupBinder = new LeafletAngularPopupBinder(appRef, envInjector);
  }

  ngOnInit(): void {
    this.initMap();

    this.gisMapService.geoData$
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((d) => this.onGeoData(d));
  }

  override ngOnDestroy(): void {
    this.popupBinder?.destroy();

    super.ngOnDestroy();
  }

  private initMap(): void {
    const userSettings = CoreUtils.getCurrentState(this.store, SettingsSelectors.selectSettings);
    this.currentZoom.next(userSettings.zoom);
    this.map = L.map('map', {
      center: [userSettings.lat, userSettings.lng],
      zoom: userSettings.zoom,
      contextmenu: true,
      contextmenuItems: [
        {
          text: this.ts.instant('i18n.ft.add-node'),
          callback: (e) => this.addNewNode(e, EquipmentType.EmptyNode)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-cable-reserve'),
          callback: (e) => this.addNewNode(e, EquipmentType.CableReserve)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-closure'),
          callback: (e) => this.addNewNode(e, EquipmentType.Closure)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-cross'),
          callback: (e) => this.addNewNode(e, EquipmentType.Cross)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-terminal'),
          callback: (e) => this.addNewNode(e, EquipmentType.Terminal)
        },
        {
          text: this.ts.instant('i18n.ft.add-node-with-other-equipment'),
          callback: (e) => this.addNewNode(e, EquipmentType.Other)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.add-rtu'),
          callback: (e) => this.addNewNode(e, EquipmentType.Rtu)
        },
        {
          text: '-',
          separator: true
        },
        {
          text: this.ts.instant('i18n.ft.copy-coordinates'),
          callback: (e) => this.copyCoordinates(e)
        },
        {
          text: this.ts.instant('i18n.ft.distance-measurement'),
          callback: (e) => this.copyCoordinates(e)
        }
      ]
    });

    this.map.on('zoomend', (e) => {
      const newZoom = this.map.getZoom();
      // GisMapLayers.adjustLayersToZoom(this.map, this.layerGroups, this.currentZoom.value, newZoom);
      this.currentZoom.next(newZoom);
      this.store.dispatch(SettingsActions.changeZoom({ zoom: newZoom }));
    });

    this.map.on('click', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(GisMapUtils.mouseToString(e.latlng, center));
    });

    this.map.on('mousemove', (e) => {
      const center = this.map.getCenter();
      this.mousePosition.next(GisMapUtils.mouseToString(e.latlng, center));
    });

    this.map.on('dragend', (e) => {
      const center = this.map.getCenter();
      this.store.dispatch(SettingsActions.changeCenter({ center }));
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap'
    }).addTo(this.map);

    // hide leaflet own attribution
    this.map.attributionControl.setPrefix('');

    this.initMapLayersMap();
  }

  private initMapLayersMap(): void {
    for (const layerTypeKey in GisMapLayer) {
      const layerType = GisMapLayer[layerTypeKey as keyof typeof GisMapLayer];
      const group = GisMapUtils.createLayerGroupByGisType(layerType);
      this.layerGroups.set(layerType, group);

      this.map.addLayer(group);
    }

    // если показывать не кластера а по зуму, то при инициализации
    // надо не просто добавить слой в карту (выше строка)
    // а сделать это в зависимомсти от текущего зума
    // GisMapService.GisMapLayerZoom.forEach((value, key) => {
    //   GisMapLayers.setLayerVisibility(
    //     this.map,
    //     this.layerGroups,
    //     key,
    //     this.currentZoom.value >= value
    //   );
    // });
  }

  geoData!: AllGeoData;
  onGeoData(data: { geoData: AllGeoData } | null): void {
    this.layerGroups.forEach((group) => group.clearLayers());

    if (!data) return;
    this.geoData = data.geoData;

    data.geoData.fibers.forEach((f) => this.addGeoFiber(f));
    data.geoData.nodes.forEach((n) => this.addNodeToLayer(n));
  }

  private addGeoFiber(fiber: GeoFiber): void {
    const options = {
      color: ColorUtils.routeStateToColor(fiber.fiberState),
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: this.buildFiberContextMenu()
    };
    const polyline = L.polyline([fiber.coors1, fiber.coors2], options);
    (<any>polyline).id = fiber.id;

    const group = this.layerGroups.get(GisMapLayer.Route)!;
    group.addLayer(polyline);
  }

  private addNodeToLayer(node: TraceNode): void {
    const marker = this.createMarker(node.coors, node.equipmentType, this.icons.getIcon(node));
    marker.bindPopup(node.title);
    (<any>marker).id = node.id;

    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node.equipmentType);
    const group = this.layerGroups.get(layerType)!;
    group.addLayer(marker);
  }

  createMarker(
    coordinate: L.LatLng,
    equipmentType: EquipmentType,
    iconWithIndex: GisIconWithZIndex
  ): L.Marker {
    const options = {
      icon: iconWithIndex.icon,
      draggable: true,
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: this.buildMarkerContextMenu(equipmentType)
    };
    const marker = L.marker(coordinate, options);

    if (iconWithIndex?.zIndex) {
      marker.setZIndexOffset(iconWithIndex.zIndex * 1000);
    }

    marker.on('click', () => {
      console.log((<any>marker).id);
    });

    marker.on('dragend', (e) => {
      this.dragMarkerWithPolylines(e);
    });

    return marker;
  }

  dragMarkerWithPolylines(e: L.DragEndEvent) {
    const position = (<L.Marker>e.target).getLatLng();
    const nodeId = (<any>e.target).id;
    const node = this.geoData.nodes.find((n) => n.id === nodeId)!;
    node.coors = position;

    const fibers = this.geoData.fibers.filter(
      (f) => f.node1id === node.id || f.node2id === node.id
    );

    const routeGroup = this.layerGroups.get(GisMapLayer.Route)!;
    fibers.forEach((f) => {
      const oldRouteLayer = routeGroup.getLayers().find((r) => (<any>r).id === f.id);
      routeGroup.removeLayer(oldRouteLayer!);

      if (f.node1id === node.id) {
        f.coors1 = position;
      } else {
        f.coors2 = position;
      }

      this.addGeoFiber(f);
    });

    // двигает карту помещая новую позицию маркера в центр
    // удобно, если затягиваешь маркер за пределы экрана,
    // на сколько это удобно если двигаешь немного в пределах экрана
    // и не ожидаешь перемещения всей карты - это вопрос
    // this.map.panTo(position);
  }

  /////////////////////
  buildFiberContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-node'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-adjustment-point'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      },
      {
        text: this.ts.instant('i18n.ft.remove-section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      }
    ];
  }

  buildMarkerContextMenu(equipmentType: EquipmentType): L.ContextMenuItem[] {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return this.buildRtuContextMenu();
      case EquipmentType.AdjustmentPoint:
        return this.buildAdjustmentPointContextMenu();
      default:
        return this.buildNodeContextMenu();
    }
  }

  buildRtuContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.define-trace'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      }
    ];
  }

  buildNodeContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.information'),
        callback: (e: L.ContextMenuItemClickEvent) => this.showInformation(e)
      },
      {
        text: this.ts.instant('i18n.ft.add-equipment'),
        callback: (e: L.ContextMenuItemClickEvent) => this.addEquipment(e)
      },
      {
        text: '-',
        separator: true
      },
      {
        text: this.ts.instant('i18n.ft.section'),
        callback: (e: L.ContextMenuItemClickEvent) => this.drawSection(e)
      }
    ];
  }

  buildAdjustmentPointContextMenu(): L.ContextMenuItem[] {
    return [
      {
        text: this.ts.instant('i18n.ft.remove'),
        callback: (e: L.ContextMenuItemClickEvent) => this.removeNode(e)
      }
    ];
  }

  // map menu
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  async addNewNode(e: L.ContextMenuItemClickEvent, equipmentType: EquipmentType) {
    console.log(`addNewNode clicked ${e.latlng}, EquipmentType: ${equipmentType}`);

    const guid =
      equipmentType === EquipmentType.EmptyNode || equipmentType === EquipmentType.AdjustmentPoint
        ? this.emptyGuid
        : crypto.randomUUID();
    console.log(guid);
    const command = {
      RequestedEquipmentId: crypto.randomUUID(),
      EmptyNodeEquipmentId: guid,
      NodeId: crypto.randomUUID(),
      Type: equipmentType,
      Latitude: e.latlng.lat,
      Longitude: e.latlng.lng
    };
    console.log(command);
    const json = JSON.stringify(command);
    const response = await firstValueFrom(
      this.graphService.sendCommand(json, 'AddEquipmentAtGpsLocation')
    );
    if (response.success) {
      const traceNode = new TraceNode(command.NodeId, '', e.latlng, equipmentType);
      this.addNodeToLayer(traceNode);
    }
  }

  copyCoordinates(e: L.ContextMenuItemClickEvent) {
    console.log(`copyCoordinates clicked ${e.latlng}`);
  }

  measureDistance(e: L.ContextMenuItemClickEvent) {
    console.log(`measureDistance clicked ${e.latlng}`);
  }

  // node menu
  showInformation(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  addEquipment(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  removeNode(e: L.ContextMenuItemClickEvent) {
    console.log((<any>e.relatedTarget).id);
  }

  drawSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }

  removeSection(e: L.ContextMenuItemClickEvent) {
    console.log(e);
  }
}
