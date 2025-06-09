import { Component, HostListener, inject, Injector, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { AppState, AuthSelectors } from 'src/app/core';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { GisMapping } from 'src/app/core/store/mapping/gis-mappings';
import { OneLandmark } from 'src/app/core/store/models/ft30/one-landmark';
import { GisMapService } from '../../gis/gis-map.service';
import { LandmarkMenu } from './one-landmark-menu/landmark-menu';
import { EquipmentType } from 'src/grpc-generated';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { CoreUtils } from 'src/app/core/core.utils';

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
  trace!: GeoTrace;
  hasBaseRef!: boolean;

  public store: Store<AppState> = inject(Store);
  hasEditGraphPermission = CoreUtils.getCurrentState(
    this.store,
    AuthSelectors.selectHasEditGraphPermission
  );
  originalLandmarks!: OneLandmark[];
  landmarksModel = new BehaviorSubject<LandmarksModel | null>(null);
  model$ = this.landmarksModel.asObservable();

  selectedLandmark = new BehaviorSubject<OneLandmark | null>(null);
  inputModel$ = this.selectedLandmark.asObservable();

  /////
  showContextMenu = false;
  menuPosition = { x: 0, y: 0 };

  contextMenuItems = [
    { label: 'i18n.ft.equipment', action: 'equipment', disabled: false },
    { label: 'i18n.ft.node', action: 'node', disabled: false },
    { label: 'i18n.ft.section', action: 'section', disabled: false }
  ];
  //////

  constructor(
    private windowService: WindowService,
    private gisService: GisService,
    private gisMapService: GisMapService,
    private injector: Injector
  ) {
    LandmarkMenu.initialize(injector);
  }

  async ngOnInit(): Promise<void> {
    this.spinning.next(true);
    this.trace = this.gisMapService.getGeoData().traces.find((t) => t.id === this.traceId)!;
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

  close() {
    this.windowService.unregisterWindow(this.traceId, 'Landmarks');
    this.gisMapService.setHighlightNode(null);
  }

  openContextMenu(event: MouseEvent, landmark: OneLandmark) {
    event.preventDefault();

    this.onLandmarkClick(landmark);
    this.contextMenuItems[0].disabled =
      landmark.equipmentType === EquipmentType.Rtu ||
      (this.trace.hasAnyBaseRef && landmark.equipmentType === EquipmentType.EmptyNode) ||
      !this.hasEditGraphPermission;
    this.menuPosition = { x: event.clientX, y: event.clientY };
    this.showContextMenu = true;
  }

  handleMenuAction(action: string) {
    const isLast = this.selectedLandmark.value!.number === this.originalLandmarks.length - 1;
    LandmarkMenu.handleMenuAction(action, this.selectedLandmark.value, this.trace, isLast);
  }

  // Close menu when clicking elsewhere
  @HostListener('document:click')
  closeContextMenu() {
    this.showContextMenu = false;
  }

  // Close menu on Escape key
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    if (this.showContextMenu) this.showContextMenu = false;
    else this.close();
  }
}
