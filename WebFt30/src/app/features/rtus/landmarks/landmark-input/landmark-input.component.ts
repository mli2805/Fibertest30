import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { OneLandmark } from 'src/app/core/store/models/ft30/one-landmark';
import { EquipmentType } from 'src/grpc-generated';
import { GpsInputComponent } from '../gps-input/gps-input.component';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { GisMapUtils } from 'src/app/features/gis/components/shared/gis-map.utils';
import { MapLayersActions } from 'src/app/features/gis/components/gis-actions/map-layers-actions';
import { GisMapLayer } from 'src/app/features/gis/components/shared/gis-map-layer';
import { BehaviorSubject } from 'rxjs';
import { MessageBoxUtils } from 'src/app/shared/components/message-box/message-box-utils';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'rtu-landmark-input',
  templateUrl: './landmark-input.component.html',
  styleUrls: ['./landmark-input.component.scss']
})
export class LandmarkInputComponent {
  @Input() set landmark(value: OneLandmark) {
    if (value) {
      this.setEquipmentTypes(value);
      const patch = { ...value, userInputLength: value.UserInputLength }; // хитрое поле в классе
      this.form.patchValue(patch); // Применяет поля объекта для обновления контролов формы
      this.model.next(value); // сигнал для gps-input
    }
  }

  model = new BehaviorSubject<OneLandmark | null>(null);
  model$ = this.model.asObservable();

  @Output() applyLandmark = new EventEmitter<OneLandmark>();

  @ViewChild('gpsInput') gpsInput!: GpsInputComponent;

  equipmentTypes!: EquipmentType[];
  form!: FormGroup;

  public store: Store<AppState> = inject(Store);
  private hasEditGraphPermission = CoreUtils.getCurrentState(
    this.store,
    AuthSelectors.selectHasEditGraphPermission
  );

  constructor(
    private gisMapService: GisMapService,
    private fb: FormBuilder,
    private dialog: Dialog
  ) {
    this.form = this.fb.group({
      nodeTitle: [''],
      nodeComment: [''],
      equipmentTitle: [''],
      equipmentType: [''],
      leftCableReserve: [''],
      rightCableReserve: [''],
      userInputLength: ['']
    });
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

  inputDisabled(): boolean {
    if (!this.hasEditGraphPermission) return true;
    if (!this.model.value) return true;
    if (this.model.value.equipmentType === EquipmentType.Rtu) return true;
    return false;
  }

  isCableReserveValid(s: string): boolean {
    const cn = s === 'right' ? 'rightCableReserve' : 'leftCableReserve';

    if (this.form.controls[cn].pristine) return true;

    const value = this.form.controls[cn].value;
    if (value === '') return true;
    return (+value).validInteger(0, 200);
  }

  isUserLengthValid(): boolean {
    if (this.form.controls['userInputLength'].pristine) return true;
    const value = this.form.controls['userInputLength'].value;
    if (value === '') return true;
    const num = +value;
    return Number.isInteger(num) && num >= 0;
  }

  onPreview(coors: L.LatLng) {
    const nodeId = this.model.value!.nodeId;
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
    let hasChanges = false;
    const changedLandmark = this.collectInput();
    if (!changedLandmark) return;

    if (this.model.value!.nodePropertiesChanged(changedLandmark)) {
      hasChanges = true;
    }

    if (hasChanges) this.applyLandmark.next(changedLandmark);
  }

  collectInput(): OneLandmark | null {
    const changedLandmark = this.model.value!.clone();

    changedLandmark.nodeTitle = this.form.controls['nodeTitle'].value;
    changedLandmark.nodeComment = this.form.controls['nodeComment'].value;
    changedLandmark.equipmentTitle = this.form.controls['equipmentTitle'].value;
    changedLandmark.equipmentType = this.form.controls['equipmentType'].value;

    const lcr = +this.form.controls['leftCableReserve'].value;
    if (!lcr.validInteger(0, 200)) {
      MessageBoxUtils.show(this.dialog, 'Error', [
        {
          message: 'i18n.ft.invalid-input',
          bold: true,
          bottomMargin: false
        }
      ]);
      return null;
    }
    changedLandmark.leftCableReserve = lcr;

    const rcr = +this.form.controls['rightCableReserve'].value;
    if (!rcr.validInteger(0, 200)) {
      MessageBoxUtils.show(this.dialog, 'Error', [
        {
          message: 'i18n.ft.invalid-input',
          bold: true,
          bottomMargin: false
        }
      ]);
      return null;
    }
    changedLandmark.rightCableReserve = rcr;

    const uil = +this.form.controls['userInputLength'].value;
    if (!Number.isInteger(uil)) {
      MessageBoxUtils.show(this.dialog, 'Error', [
        {
          message: 'i18n.ft.invalid-input',
          bold: true,
          bottomMargin: false
        }
      ]);
      return null;
    }
    changedLandmark.UserInputLength = uil;

    const coors = this.gpsInput.getInput();
    if (coors) changedLandmark.gpsCoors = coors;

    return changedLandmark;
  }

  cancelChanges() {
    //
  }
}
