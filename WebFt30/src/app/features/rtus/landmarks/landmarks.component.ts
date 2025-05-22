import { Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { AppState } from 'src/app/core';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import { OneLandmark } from 'src/app/core/store/models/ft30/one-landmark';
import { GisMapService } from '../../gis/gis-map.service';

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

  public store: Store<AppState> = inject(Store);

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
    this.selectedLandmark.next(this.originalLandmarks[0]);
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

  onLandmarkClick(landmark: OneLandmark) {
    this.landmarksModel.value!.landmarks.forEach(
      (l) => (l.isSelected = l.number === landmark.number)
    );
    this.selectedLandmark.next(landmark);
    this.gisMapService.setHighlightNode(landmark.nodeId);
  }

  updateTable(changedLandmark: OneLandmark) {
    console.log(changedLandmark);
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
