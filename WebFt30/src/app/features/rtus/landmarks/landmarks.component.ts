import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, delay, firstValueFrom } from 'rxjs';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { AppState, AuthSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import { OneLandmark } from 'src/app/core/store/models/ft30/one-landmark';
import { Utils } from 'src/app/shared/utils/utils';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapService } from '../../gis/gis-map.service';
import { MapActions } from '../../gis/components/gis-actions/map-actions';
import { MapMouseActions } from '../../gis/components/gis-actions/map-mouse-actions';
import { GisMapUtils } from '../../gis/components/shared/gis-map.utils';
import { MapLayersActions } from '../../gis/components/gis-actions/map-layers-actions';
import { GisMapLayer } from '../../gis/components/shared/gis-map-layer';

interface LandmarksModel {
  landmarks: OneLandmark[];
}

@Component({
  selector: 'rtu-landmarks',
  templateUrl: './landmarks.component.html',
  styleUrls: ['./landmarks.component.scss']
})
export class LandmarksComponent implements OnInit {
  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  @Input() traceId!: string;
  equipmentTypes!: EquipmentType[];
  form!: FormGroup;

  public store: Store<AppState> = inject(Store);
  private hasEditGraphPermission = CoreUtils.getCurrentState(
    this.store,
    AuthSelectors.selectHasEditGraphPermission
  );

  originalLandmarks!: OneLandmark[];
  landmarksModel = new BehaviorSubject<LandmarksModel | null>(null);
  model$ = this.landmarksModel.asObservable();
  selectedLandmark = new BehaviorSubject<OneLandmark | null>(null);
  inputModel$ = this.selectedLandmark.asObservable();

  constructor(
    private windowService: WindowService,
    private gisService: GisService,
    private gisMapService: GisMapService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinning.next(true);
    const response = await firstValueFrom(this.gisService.getLandmarks(this.traceId));
    this.spinning.next(false);
    if (response === null) this.close();

    this.originalLandmarks = response.landmarks.map((l) => GisMapping.fromOneLandmark(l));
    this.originalLandmarks[0].isSelected = true;
    await this.setSelectedLandmark(this.originalLandmarks[0]);
    this.landmarksModel.next({ landmarks: this.originalLandmarks });
  }

  // переключатель показа всех ориентиров или только с оборудованием
  onlyEquipment = false;
  onEquipmChanged() {
    this.onlyEquipment = !this.onlyEquipment;

    const lms = this.onlyEquipment
      ? this.originalLandmarks.filter((l) => l.isEquipmentLandmark())
      : this.originalLandmarks;

    if (lms.findIndex((l) => l.isSelected) === -1) {
      this.onLandmarkClick(lms[0]);
    }

    this.landmarksModel.next({ landmarks: lms });
  }

  setEquipmentTypes(landmark: OneLandmark) {
    if (landmark.equipmentType === EquipmentType.Rtu) {
      this.equipmentTypes = [EquipmentType.Rtu];
    } else if (landmark.equipmentType === EquipmentType.EmptyNode) {
      this.equipmentTypes = [EquipmentType.EmptyNode];
    } else {
      this.equipmentTypes = [
        EquipmentType.Closure,
        EquipmentType.Cross,
        EquipmentType.Terminal,
        EquipmentType.CableReserve,
        EquipmentType.Other
      ];
    }
  }

  async setSelectedLandmark(landmark: OneLandmark) {
    this.selectedLandmark.next(null);
    await Utils.delay(100);

    this.setEquipmentTypes(landmark);
    const userInputLength = landmark.isUserInput ? landmark.gpsDistance : '';
    this.form = new FormGroup({
      nodeTitle: new FormControl(landmark.nodeTitle),
      nodeComment: new FormControl(landmark.nodeComment),
      equipmentTitle: new FormControl(landmark.equipmentTitle),
      equipmentType: new FormControl(landmark.equipmentType),
      leftCableReserve: new FormControl(landmark.leftCableReserve),
      rightCableReserve: new FormControl(landmark.rightCableReserve),
      userInputLength: new FormControl(userInputLength)
    });

    this.selectedLandmark.next(landmark);
  }

  inputDisabled(): boolean {
    if (!this.hasEditGraphPermission) return true;
    if (this.selectedLandmark.value?.equipmentType === EquipmentType.Rtu) return true;
    return false;
  }

  onLandmarkClick(landmark: OneLandmark) {
    this.landmarksModel.value!.landmarks.forEach(
      (l) => (l.isSelected = l.number === landmark.number)
    );
    this.setSelectedLandmark(landmark);
    this.gisMapService.setHighlightNode(landmark.nodeId);
  }

  onPreview(coors: L.LatLng) {
    const nodeId = this.selectedLandmark.value!.nodeId;
    this.moveNodeForPreview(nodeId, coors);
    this.gisMapService.setHighlightNode(nodeId);
  }

  //  в MapLayersActions уже есть для тягаемого узла, но там при старте тягания сохраняется узел/маркер и список волокон/полилайнов
  moveNodeForPreview(nodeId: string, coors: L.LatLng) {
    const node = this.gisMapService.getNode(nodeId);
    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node!.equipmentType);
    const group = this.gisMapService.getLayerGroups().get(layerType);
    const marker = group!.getLayers().find((m) => (<any>m).id === nodeId);

    group?.removeLayer(marker!);
    node.setCoors(coors);
    const newMarker = MapLayersActions.addNodeToLayer(node);

    const routesGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route);
    this.gisMapService.getGeoData().fibers.forEach((f) => {
      if (f.node1id === nodeId || f.node2id === nodeId) {
        const route = routesGroup!.getLayers().find((r) => (<any>r).id === f.id);
        routesGroup?.removeLayer(route!);
        if (f.node1id === nodeId) {
          f.coors1 = coors;
        } else {
          f.coors2 = coors;
        }
        const polyline = MapLayersActions.addFiberToLayer(f);
      }
    });
  }

  updateTable() {
    //
  }

  cancelChanges() {
    //
  }

  cancelAllChanges() {
    //
  }

  saveChanges() {
    //
  }
  /////////////////////////////
  zIndex = 1;
  bringToFront() {
    this.windowService.bringToFront(this.traceId, 'Landmarks');
    this.updateZIndex();
  }

  private updateZIndex() {
    const windowData = this.windowService.getWindows().find((w) => w.id === this.traceId);
    // Обновляем только если значение изменилось
    if (windowData?.zIndex !== this.zIndex) {
      this.zIndex = windowData?.zIndex || 1;
    }
  }

  close() {
    this.windowService.unregisterWindow(this.traceId, 'Landmarks');
    this.gisMapService.setHighlightNode(null);
  }
}
