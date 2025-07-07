import { Component, HostListener, inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import {
  AppState,
  AuthSelectors,
  LandmarksModelsActions,
  LandmarksModelsSelectors,
  LatLngFormat,
  LatLngFormats,
  SettingsActions,
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
export class LandmarksComponent implements OnInit, OnDestroy {
  @Input() windowId!: string; // трасса может поменяться, от рту может быть более одного окна с ориентирами
  traceId!: string;
  nodeId!: string; // TODO получить в payload
  @Input() set payload(value: any) {
    this.traceId = value.traceId;
  }
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

  rtuTraces!: GeoTrace[];

  lmsModelIds!: string[];
  lmsModelId!: string;
  loading$ = this.store.select(LandmarksModelsSelectors.selectLoading);

  modelSubscription = new Subscription();
  landmarksModel = new BehaviorSubject<LandmarksModel | null>(null);
  lmsModel$ = this.landmarksModel.asObservable();

  selectedLandmark = new BehaviorSubject<ColoredLandmark | null>(null);
  inputModel$ = this.selectedLandmark.asObservable();

  // восстановить при выходе
  gpsInputFormat!: LatLngFormat;

  constructor(
    private windowService: WindowService,
    private gisService: GisService,
    private gisMapService: GisMapService,
    private injector: Injector
  ) {
    LandmarkMenu.initialize(injector);
  }

  async ngOnInit(): Promise<void> {
    this.lmsModelIds = [];
    this.gpsInputFormat = CoreUtils.getCurrentState(
      this.store,
      SettingsSelectors.selectLatLngFormat
    );
    this.selectedLatLngFormat$.next(this.gpsInputFormat);

    this.initializeLandmarksFromTraceId();

    this.rtuTraces = this.gisMapService
      .getGeoData()
      .traces.filter((t) => t.equipmentIds[0] === this.trace.equipmentIds[0]);
  }

  initializeLandmarksFromTraceId() {
    this.lmsModelId = crypto.randomUUID();
    if (!this.lmsModelIds.includes(this.lmsModelId)) {
      // возможны переключения на другую трассу, храним id всех моделей
      this.lmsModelIds.push(this.lmsModelId);
    }
    // переподписываемся с новым lmsModelId
    const modelInStore$ = this.store.select(
      LandmarksModelsSelectors.selectLandmarksModelById(this.lmsModelId)
    );
    // но данные из стора нельзя редактировать напрямую, только через actions/reducers
    this.modelSubscription.add(
      modelInStore$.subscribe((model) => {
        if (model) {
          // восстановление экземпляра из POCO, по какой-то причине первый раз (при создании) это не надо было,
          // но затем при изменении получаем plain object без методов
          const restored = new LandmarksModel(model);
          // делаем глубокую копия объекта из стора, теперь его можно изменять
          const mutable = restored.clone();

          const newSelectedLandmark = this.getNewSelectedLandmark(mutable);
          newSelectedLandmark.isSelected = true;

          this.landmarksModel.next(mutable);
          this.selectedLandmark.next(newSelectedLandmark);
        }
      })
    );
    this.store.dispatch(
      LandmarksModelsActions.createLandmarksModel({
        landmarksModelId: this.lmsModelId,
        traceId: this.traceId
      })
    );

    this.trace = this.gisMapService.getGeoData().traces.find((t) => t.id === this.traceId)!;
  }

  getNewSelectedLandmark(mutable: LandmarksModel): ColoredLandmark {
    if (this.selectedLandmark.value === null) {
      // если только открыли форму selectedLandmark еще неопределен
      return mutable.landmarks[0];
    }

    const nodeId = this.selectedLandmark.value.nodeId;
    const landmark = mutable.landmarks.find((l) => l.nodeId === nodeId);
    if (landmark === undefined) {
      // если сменили трассу в новой может не быть такого узла
      return mutable.landmarks[0];
    }

    return landmark;
  }

  ngOnDestroy(): void {
    this.store.dispatch(
      SettingsActions.changeLatLngFormatNoPersist({ latLngFormat: this.gpsInputFormat })
    );
    this.store.dispatch(
      LandmarksModelsActions.deleteLandmarksModel({ landmarksModelId: this.lmsModelId })
    );
  }

  // переключатель показа всех ориентиров или только с оборудованием
  isFilterOn = false;
  onFilterChanged() {
    this.isFilterOn = !this.isFilterOn;
    this.store.dispatch(
      LandmarksModelsActions.updateLandmarksModel({
        landmarksModelId: this.lmsModelId,
        changedLandmark: undefined,
        isFilterOn: this.isFilterOn
      })
    );
  }

  // переключатель формата показа координат, только на этой форме
  // временно меняем значение в хранилище, по закрытию формы вернем
  public latLngFormats = <any>LatLngFormats;
  public selectedLatLngFormat$ = new BehaviorSubject<LatLngFormat | null>(null);
  onLatLngFormatChanged(latLngFormat: LatLngFormat) {
    this.selectedLatLngFormat$.next(latLngFormat);
    this.store.dispatch(SettingsActions.changeLatLngFormatNoPersist({ latLngFormat }));
  }

  onTraceChanged(trace: GeoTrace) {
    this.traceId = trace.id;
    this.initializeLandmarksFromTraceId();
  }

  onLandmarkClick(landmark: ColoredLandmark) {
    this.landmarksModel.value!.landmarks.forEach(
      (l) => (l.isSelected = l.number === landmark.number)
    );
    this.selectedLandmark.next(landmark);
    this.gisMapService.setHighlightNode(landmark.nodeId);
  }

  updateTable(changedLandmark: ColoredLandmark) {
    this.store.dispatch(
      LandmarksModelsActions.updateLandmarksModel({
        landmarksModelId: this.lmsModelId,
        changedLandmark: changedLandmark,
        isFilterOn: undefined
      })
    );
  }

  cancelOneLandmarkChanges(row: number) {
    this.store.dispatch(
      LandmarksModelsActions.cancelOneLandmarkChanges({
        landmarksModelId: this.lmsModelId,
        row: row
      })
    );
  }

  cancelAllChanges() {
    this.store.dispatch(
      LandmarksModelsActions.clearLandmarksModel({
        landmarksModelId: this.lmsModelId
      })
    );
  }

  saveChanges() {
    //
  }

  close() {
    this.windowService.unregisterWindow(this.windowId, 'Landmarks');
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
    const isLast =
      this.selectedLandmark.value!.number === this.landmarksModel.value!.landmarks.length - 1;
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
