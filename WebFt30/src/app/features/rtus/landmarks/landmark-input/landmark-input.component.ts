import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { EquipmentType } from 'src/grpc-generated';
import { GpsInputComponent } from '../gps-input/gps-input.component';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { MapLayersActions } from 'src/app/features/gis/components/gis-actions/map-layers-actions';
import { BehaviorSubject } from 'rxjs';
import { MessageBoxUtils } from 'src/app/shared/components/message-box/message-box-utils';
import { Dialog } from '@angular/cdk/dialog';
import { ColoredLandmark } from 'src/app/core/store/models/ft30/colored-landmark';

@Component({
  selector: 'rtu-landmark-input',
  templateUrl: './landmark-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandmarkInputComponent {
  originalLandmark!: ColoredLandmark;
  @Input() set landmark(value: ColoredLandmark) {
    this.originalLandmark = value;
    this.initializeForm(value);
  }

  canShow = new BehaviorSubject<boolean | null>(null);
  canShow$ = this.canShow.asObservable();

  @Output() applyLandmark = new EventEmitter<ColoredLandmark>();
  @Output() cancelLandmark = new EventEmitter<number>();

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

  initializeForm(value: ColoredLandmark) {
    this.canShow.next(null);
    if (value) {
      this.setEquipmentTypes(value);
      const patch = { ...value, userInputLength: value.UserInputLength }; // хитрое поле в классе
      this.form.patchValue(patch); // Применяет поля объекта для обновления контролов формы
      this.form.markAsPristine();
      this.canShow.next(true); // сигнал что инициализация прошла, можно рендерить
    }
  }

  setEquipmentTypes(landmark: ColoredLandmark) {
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
    if (!this.canShow.value) return true;
    if (this.originalLandmark.equipmentType === EquipmentType.Rtu) return true;
    return false;
  }

  equipmentTitleInputDisabled() {
    if (!this.hasEditGraphPermission) return true;
    if (!this.canShow.value) return true;
    return this.originalLandmark.equipmentType === EquipmentType.EmptyNode;
  }

  leftCableReserveInputDisabled(): boolean {
    if (this.inputDisabled()) return true;
    if (this.originalLandmark.equipmentType === EquipmentType.EmptyNode) return true;
    return false;
  }

  rightCableReserveInputDisabled(): boolean {
    if (this.leftCableReserveInputDisabled()) return true;
    const eqType = this.form.controls['equipmentType'].value;
    if (eqType === EquipmentType.CableReserve || eqType === EquipmentType.Terminal) return true;
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
    const nodeId = this.originalLandmark.nodeId;
    const node = this.gisMapService.getNode(nodeId);
    node.coors = coors;
    MapLayersActions.reDrawNodeWithItsFibers(node);
    this.gisMapService.setHighlightNode(nodeId);
  }

  isUpdateTableDisabled() {
    if (!this.gpsInput) return true;
    return this.form.pristine && this.gpsInput.isPreviewDisabled();
  }

  isCancelDisabled() {
    return !this.originalLandmark.isChanged;
  }

  updateTable() {
    let hasChanges = false;
    const changedLandmark = this.collectInput();
    if (!changedLandmark) return;
    if (this.originalLandmark.areAnyPropertyChanged(changedLandmark)) {
      hasChanges = true;
    }

    if (hasChanges) this.applyLandmark.next(changedLandmark);
  }

  collectInput(): ColoredLandmark | null {
    const changedLandmark = this.originalLandmark.clone();

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
    changedLandmark.UserInputLength = this.form.controls['userInputLength'].value;
    const coors = this.gpsInput.getInput();
    if (coors) changedLandmark.gpsCoors = coors;

    return changedLandmark;
  }

  cancelChanges() {
    this.cancelLandmark.next(this.originalLandmark.number);
  }
}
