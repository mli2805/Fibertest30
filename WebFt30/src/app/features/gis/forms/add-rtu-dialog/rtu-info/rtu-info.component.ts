import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { EquipmentType } from 'src/grpc-generated';

export enum RtuInfoMode {
  'AddRtu',
  'ShowInformation'
}

@Component({
  selector: 'rtu-rtu-info',
  templateUrl: './rtu-info.component.html',
  styleUrls: ['./rtu-info.component.scss']
})
export class RtuInfoComponent {
  hasPermission!: boolean;
  mode!: RtuInfoMode;
  rtuId!: string;
  rtuNode!: TraceNode;
  form!: FormGroup;

  @Input() set data(value: any) {
    this.hasPermission = value.hasPermission;
    this.mode = value.mode;
    this.rtuId = value.rtuId;
    this.rtuNode = value.rtuNode;
    this.form = new FormGroup({
      title: new FormControl(value.rtuNode.title, [this.rtuTitleValidator()]),
      comment: new FormControl(value.rtuNode.comment)
    });
  }

  @Output() closeEvent = new EventEmitter<TraceNode | null>();
  constructor(private gisMapService: GisMapService, private ts: TranslateService) {}

  isDisabled() {
    return !this.hasPermission;
  }

  rtuTitleValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // if (control.pristine) return null;
      if (control.value === '') return { invalidTitle: { value: 'required' } };
      // еще надо проверить уникальность
      const rtus = this.gisMapService
        .getGeoData()
        .equipments.filter((e) => e.type === EquipmentType.Rtu && e.title === control.value);
      if (rtus.length > 1) return { invalidTitle: { value: 'not unique' } };
      if (rtus.length === 1 && rtus[0].id !== this.rtuId)
        return { invalidTitle: { value: 'not unique' } };
      return null;
    };
  }

  isRtuTitleValid() {
    return this.form.controls['title'].valid;
  }

  isApplyDisabled() {
    if (this.form.pristine) return true;
    if (!this.form.valid) return true;

    return false;
  }

  async onApplyClicked() {
    this.rtuNode.title = this.form.controls['title'].value;
    this.rtuNode.comment = this.form.controls['comment'].value;
    this.closeEvent.emit(this.rtuNode);
  }

  onDiscardClicked() {
    this.closeEvent.emit(null);
  }
}
