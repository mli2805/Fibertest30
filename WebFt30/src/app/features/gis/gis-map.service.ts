import { Injectable } from '@angular/core';
import { GisMapLayer } from './components/shared/gis-map-layer';
import { BehaviorSubject, Subject } from 'rxjs';
import { AllGeoData, GeoFiber, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import * as L from 'leaflet';
import { GisMapUtils } from './components/shared/gis-map.utils';
import { StepModel } from './forms/trace-define/step-model';

@Injectable({
  providedIn: 'root'
})
export class GisMapService {
  public static GisMapLayerZoom = new Map<GisMapLayer, number>([
    [GisMapLayer.Route, 0],
    [GisMapLayer.TraceEquipment, 16],
    [GisMapLayer.EmptyNodes, 16],
    [GisMapLayer.AdjustmentPoints, 16]
  ]);

  ////////////////
  sliderMouseDown: MouseEvent | null = null;

  ///////////////////////
  geoDataLoading = new BehaviorSubject<boolean>(false);
  ///////////////////// все узлы и участки для карты root'а
  private geoData!: AllGeoData;
  getGeoData(): AllGeoData {
    return this.geoData;
  }

  private geoDataSubject = new BehaviorSubject<{ geoData: AllGeoData } | null>(null);
  geoData$ = this.geoDataSubject.asObservable();

  setGeoData(geoData: AllGeoData): void {
    this.geoData = geoData;
    this.geoDataSubject.next({ geoData });
  }

  //
  // попробуем для случаев когда уверен что узел есть
  getNode(nodeId: string): TraceNode {
    return this.geoData.nodes.find((n) => n.id === nodeId)!;
  }

  getNodeFibers(nodeId: string): GeoFiber[] {
    return this.geoData.fibers.filter((f) => f.node1id === nodeId || f.node2id === nodeId);
  }

  getAnotherFiberOfAdjustmentPoint(adjustmentPointId: string, fiberId: string): GeoFiber {
    return this.geoData.fibers.find(
      (f) =>
        (f.node1id === adjustmentPointId || f.node2id === adjustmentPointId) && f.id !== fiberId
    )!;
  }

  ///////////////////////
  private map!: L.Map;

  setMap(map: L.Map): void {
    this.map = map;
  }

  getMap(): L.Map {
    return this.map;
  }

  mapSourceId = new BehaviorSubject<number>(1);
  mapSourceId$ = this.mapSourceId.asObservable();

  private layerGroups!: Map<GisMapLayer, L.FeatureGroup>;

  setLayerGroups(groups: Map<GisMapLayer, L.FeatureGroup>) {
    this.layerGroups = groups;
  }

  getLayerGroups(): Map<GisMapLayer, L.FeatureGroup> {
    return this.layerGroups;
  }

  // skipMovingCenter = false;
  //////////////////
  showNodesFromZoom = new BehaviorSubject<number>(16);
  showNodesFromZoom$ = this.showNodesFromZoom.asObservable();
  setShowNodesFromZoom(fromZoom: number) {
    GisMapService.GisMapLayerZoom.set(GisMapLayer.TraceEquipment, fromZoom);
    GisMapService.GisMapLayerZoom.set(GisMapLayer.EmptyNodes, fromZoom);
    GisMapService.GisMapLayerZoom.set(GisMapLayer.AdjustmentPoints, fromZoom);

    this.showNodesFromZoom.next(fromZoom);
  }

  currentZoom = new BehaviorSubject<number>(16);
  currentZoom$ = this.currentZoom.asObservable();

  mousePos!: L.LatLng;
  setMousePos(e: L.LatLng) {
    this.mousePos = e;
    this.mousePosition.next(e);
  }
  moveCenterToMousePos() {
    if (this.mousePos === undefined) return;
    this.map.setView(this.mousePos);
  }
  mousePosition = new BehaviorSubject<L.LatLng | null>(null);
  mousePosition$ = this.mousePosition.asObservable();

  //////////////////////////////////////////
  showSectionInfoFromLandmarks = false;
  showSectionInfoDialog = new BehaviorSubject<string | null>(null);
  showSectionInfoDialog$ = this.showSectionInfoDialog.asObservable();

  setShowSectionInfoDialog(fiberId: string | null, fromLandmarks = false) {
    this.showSectionInfoFromLandmarks = fromLandmarks;
    this.showSectionInfoDialog.next(fiberId);
  }

  showNodeInfoFromLandmarks = false;
  showNodeInfoDialog = new BehaviorSubject<string | null>(null);
  showNodeInfoDialog$ = this.showNodeInfoDialog.asObservable();

  setShowNodeInfoDialog(nodeId: string | null, fromLandmarks = false) {
    this.showNodeInfoFromLandmarks = fromLandmarks;
    this.showNodeInfoDialog.next(nodeId);
  }

  /////////////////////////
  addSectionMode = false;
  sectionWithNodes = false; // действует только совместно с addSectionMode
  addSectionFromNodeId = GisMapUtils.emptyGuid;
  addSectionFromCoors!: L.LatLng;

  dragNodeMode = false;
  draggedNodeId!: string;
  draggedNode!: TraceNode | undefined;
  draggedMarkerGroup!: L.FeatureGroup | undefined;
  draggedMarker!: L.Layer | undefined;
  draggedFibers!: GeoFiber[];
  draggedPolylines!: L.Layer[];

  //////////////////////////////
  // пока используется чтобы показать RTU по клику в дереве
  externalCommand = new BehaviorSubject<any>({});
  externalCommand$ = this.externalCommand.asObservable();

  //////////////////////////////
  steps!: StepModel[];

  clearSteps() {
    this.steps = [];
    this.stepList.next(this.steps);
  }

  addStep(step: StepModel) {
    this.steps.push(step);
    this.stepList.next(this.steps);
  }

  cancelLastStep() {
    this.steps.pop();
    this.stepList.next(this.steps);
  }

  stepList = new BehaviorSubject<StepModel[]>([]);
  stepList$ = this.stepList.asObservable();

  ///////////////////////////
  previousHighlightNode: string | null = null;
  private highlightNode = new BehaviorSubject<string | null>(null);

  setHighlightNode(value: string | null) {
    this.previousHighlightNode = this.highlightNode.value;
    this.highlightNode.next(value);
  }

  highlightNode$ = this.highlightNode.asObservable();
  ////////////////////////
  menuOwnerId = '';
}
