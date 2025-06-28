import { Component, HostListener, inject, Injector, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import {
  AppState,
  AuthSelectors,
  LandmarksModelsActions,
  LandmarksModelsSelectors,
  SettingsSelectors
} from 'src/app/core';
import { GisService } from 'src/app/core/grpc/services/gis.service';
import { GisMapService } from '../../gis/gis-map.service';
import { LandmarkMenu } from './one-landmark-menu/landmark-menu';
import { EquipmentType } from 'src/grpc-generated';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { CoreUtils } from 'src/app/core/core.utils';
import { ColoredLandmark, LandmarksModel } from 'src/app/core/store/models/ft30/colored-landmark';

@Component({
  selector: 'rtu-landmarks',
  templateUrl: './landmarks.component.html'
})
export class LandmarksComponent implements OnInit {
  spinning = new BehaviorSubject<boolean>(false);
  spinning$ = this.spinning.asObservable();

  @Input() traceId!: string;
  @Input() zIndex!: number;
  trace!: GeoTrace;
  hasBaseRef!: boolean;

  public store: Store<AppState> = inject(Store);
  hasEditGraphPermission = CoreUtils.getCurrentState(
    this.store,
    AuthSelectors.selectHasEditGraphPermission
  );

  /////
  showContextMenu = false;
  menuPosition = { x: 0, y: 0 };

  contextMenuItems = [
    { label: 'i18n.ft.equipment', action: 'equipment', disabled: false },
    { label: 'i18n.ft.node', action: 'node', disabled: false },
    { label: 'i18n.ft.section', action: 'section', disabled: false }
  ];
  //////

  lmsModelId!: string;
  // lmsModel$ = this.store.select(LandmarksModelsSelectors.selectUserById(this.lmsModelId));
  loading$ = this.store.select(LandmarksModelsSelectors.selectLoading);

  modelSubscription = new Subscription();
  landmarksModel = new BehaviorSubject<LandmarksModel | null>(null);
  lmsModel$ = this.landmarksModel.asObservable();

  selectedLandmark = new BehaviorSubject<ColoredLandmark | null>(null);
  inputModel$ = this.selectedLandmark.asObservable();

  constructor(
    private windowService: WindowService,
    private gisService: GisService,
    private gisMapService: GisMapService,
    private injector: Injector
  ) {
    LandmarkMenu.initialize(injector);
  }

  async ngOnInit(): Promise<void> {
    const gpsInputMode = CoreUtils.getCurrentState(
      this.store,
      SettingsSelectors.selectLanLngFormatName
    );
    this.lmsModelId = crypto.randomUUID();
    // переподписываемся с новым lmsModelId
    const modelInStore$ = this.store.select(
      LandmarksModelsSelectors.selectLandmarksModelById(this.lmsModelId)
    );
    // но данные из стора нельзя редактировать напрямую, только через actions/reducers
    this.modelSubscription.add(
      modelInStore$.subscribe((model) => {
        if (model) {
          // делаем глубокую копия объекта из стора, теперь его можно изменять
          const mutable = model.clone();
          mutable.landmarks[0].isSelected = true;
          this.landmarksModel.next(mutable);
          this.selectedLandmark.next(this.landmarksModel.value!.landmarks[0]);
        }
      })
    );
    this.store.dispatch(
      LandmarksModelsActions.createLandmarksModel({
        landmarksModelId: this.lmsModelId,
        traceId: this.traceId,
        gpsInputMode: gpsInputMode
      })
    );

    this.trace = this.gisMapService.getGeoData().traces.find((t) => t.id === this.traceId)!;
  }

  // переключатель показа всех ориентиров или только с оборудованием
  onlyEquipment = false;
  onEquipmChanged() {
    // this.onlyEquipment = !this.onlyEquipment;
    // const lms = this.onlyEquipment
    //   ? this.originalLandmarks.filter((l) => l.isEquipmentLandmark())
    //   : this.originalLandmarks;
    // if (lms.findIndex((l) => l.isSelected) === -1) {
    //   this.onLandmarkClick(lms[0]);
    // }
    // this.landmarksModel.next({ landmarks: lms });
  }

  onLandmarkClick(landmark: ColoredLandmark) {
    this.landmarksModel.value!.landmarks.forEach(
      (l) => (l.isSelected = l.number === landmark.number)
    );
    this.selectedLandmark.next(landmark);
    this.gisMapService.setHighlightNode(landmark.nodeId);
  }

  updateTable(changedLandmark: ColoredLandmark) {
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

  openContextMenu(event: MouseEvent, landmark: ColoredLandmark) {
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
    // const isLast = this.selectedLandmark.value!.number === this.originalLandmarks.length - 1;
    // LandmarkMenu.handleMenuAction(action, this.selectedLandmark.value, this.trace, isLast);
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
