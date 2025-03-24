import * as L from 'leaflet';
import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { GisMapUtils } from '../shared/gis-map.utils';
import { Store } from '@ngrx/store';
import { AppState, SettingsActions } from 'src/app/core';
import { GisMapLayers } from '../shared/gis-map-layers';
import { GisMapLayer } from '../shared/gis-map-layer';
import { MapLayersActions } from './map-layers-actions';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';

export class MapMouseActions {
  private static gisMapService: GisMapService;
  private static graphService: GraphService;
  private static store: Store<AppState>;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
    this.store = injector.get(Store<AppState>);
  }

  static lineInProgress: L.Polyline;
  static onMouseMove(e: L.LeafletMouseEvent) {
    const pos = e.latlng;
    this.gisMapService.setMousePos(e.latlng);

    // перерисовать временное волокно во время создания участка
    if (this.gisMapService.addSectionMode) {
      if (this.lineInProgress !== undefined) {
        this.gisMapService.getMap().removeLayer(this.lineInProgress);
      }

      const options = { color: 'black', weight: 1 };
      this.lineInProgress = L.polyline([this.gisMapService.addSectionFromCoors, pos], options);
      const group = this.gisMapService.getLayerGroups().get(GisMapLayer.Route)!;
      group.addLayer(this.lineInProgress);
    }

    // перерисовать узел который тягаем
    if (this.gisMapService.dragNodeMode) {
      this.gisMapService.draggedMarkerGroup?.removeLayer(this.gisMapService.draggedMarker!);

      this.gisMapService.draggedNode?.setCoors(pos);
      const marker = MapLayersActions.addNodeToLayer(this.gisMapService.draggedNode!);
      this.gisMapService.draggedMarker = marker;

      const routesGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route);
      this.gisMapService.draggedPolylines.forEach((r) => {
        routesGroup!.removeLayer(r);
      });
      this.gisMapService.draggedPolylines = [];
      this.gisMapService.draggedFibers.forEach((f) => {
        if (f.node1id === this.gisMapService.draggedNodeId) {
          f.coors1 = pos;
        } else {
          f.coors2 = pos;
        }
        const polyline = MapLayersActions.addFiberToLayer(f);
        this.gisMapService.draggedPolylines.push(polyline);
      });
    }
  }

  static onZoom(e: L.LeafletEvent) {
    if (this.gisMapService.zoomByFitBounds) return;

    this.gisMapService.moveCenterToMousePos();
    const newZoom = this.gisMapService.getMap().getZoom();
    GisMapLayers.adjustLayersToZoom(
      this.gisMapService.getMap(),
      this.gisMapService.getLayerGroups(),
      this.gisMapService.currentZoom.value,
      newZoom
    );
    this.gisMapService.currentZoom.next(newZoom);
    this.store.dispatch(SettingsActions.changeZoom({ zoom: newZoom }));
  }

  static onClick() {
    // если рисуем волокно - клик на пустом месте означает отмену
    if (this.gisMapService.addSectionMode) {
      if (this.lineInProgress !== undefined) {
        this.gisMapService.getMap().removeLayer(this.lineInProgress);
      }
      this.gisMapService.addSectionMode = false;
    }
  }

  static onDragEnd() {
    const center = this.gisMapService.getMap().getCenter();
    this.store.dispatch(SettingsActions.changeCenter({ center }));
  }

  static onMouseDownOnNode(e: L.LeafletMouseEvent, nodeId: string) {
    // Ctrl нажат - начать тягание узла
    if (e.originalEvent.ctrlKey && !this.gisMapService.dragNodeMode) {
      // временно запретить тягание карты
      this.gisMapService.getMap().dragging.disable();

      this.gisMapService.dragNodeMode = true;
      this.gisMapService.draggedNodeId = nodeId;

      const node = this.gisMapService.getGeoData().nodes.find((n) => n.id === nodeId);
      this.gisMapService.draggedNode = node;
      const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node!.equipmentType);
      const group = this.gisMapService.getLayerGroups().get(layerType);
      this.gisMapService.draggedMarkerGroup = group;
      const marker = group!.getLayers().find((m) => (<any>m).id === nodeId);
      this.gisMapService.draggedMarker = marker;

      const routesGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route);
      this.gisMapService.draggedFibers = [];
      this.gisMapService.draggedPolylines = [];
      this.gisMapService.getGeoData().fibers.forEach((f) => {
        if (f.node1id === nodeId || f.node2id === nodeId) {
          this.gisMapService.draggedFibers.push(f);
          const route = routesGroup!.getLayers().find((r) => (<any>r).id === f.id);
          this.gisMapService.draggedPolylines.push(route!);
        }
      });
    }
  }

  static async onMouseUpOnNode(e: L.LeafletMouseEvent, nodeId: string) {
    // завершить тягание узла
    if (this.gisMapService.dragNodeMode) {
      this.gisMapService.dragNodeMode = false;
      this.gisMapService.getMap().dragging.enable();

      const command = {
        NodeId: nodeId,
        Latitude: e.latlng.lat,
        Longitude: e.latlng.lng
      };
      const json = JSON.stringify(command);
      await firstValueFrom(this.graphService.sendCommand(json, 'MoveNode'));
    }
  }
}
