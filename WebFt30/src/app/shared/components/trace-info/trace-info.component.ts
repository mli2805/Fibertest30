import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { EquipmentType } from 'src/grpc-generated';
import { RadioButton } from '../svg-buttons/radio-button/radio-button';
import { GisMapService } from 'src/app/features/gis/gis-map.service';

interface EquipmentTypeItem {
  type: EquipmentType;
  count: number;
}

@Component({
  selector: 'rtu-trace-info',
  templateUrl: './trace-info.component.html',
  styleUrls: ['./trace-info.component.css']
})
export class TraceInfoComponent implements OnInit {
  types: EquipmentTypeItem[] = [];
  emptyNodeCount = 0;
  equipmentCount = 0;
  nodeCount = 0;
  pointCount = 0;

  hasPermission!: boolean;
  trace!: GeoTrace;
  rtuTitle!: string;
  port!: string;
  form!: FormGroup;
  radioButtons!: RadioButton[];

  @Input() set data(value: any) {
    this.hasPermission = value.hasPermission;
    this.trace = value.trace;
    this.rtuTitle = value.rtuTitle;
    this.port =
      value.trace.state === FiberState.NotJoined
        ? this.ts.instant('i18n.ft.not-joined')
        : value.port;
    this.radioButtons = [];
    const dark = new RadioButton();
    dark.id = 0;
    dark.isSelected = this.trace.darkMode;
    dark.title = this.ts.instant('i18n.ft.dark');
    this.radioButtons.push(dark);
    const inService = new RadioButton();
    inService.id = 1;
    inService.isSelected = !this.trace.darkMode;
    inService.title = this.ts.instant('i18n.ft.in-service');
    this.radioButtons.push(inService);

    this.form = new FormGroup({
      title: new FormControl(this.trace.title, [this.traceTitleValidator()]),
      comment: new FormControl(this.trace.comment)
    });

    for (let i = 0; i < value.types.length; i++) {
      const element = value.types[i];
      if (element.type !== EquipmentType.AdjustmentPoint) {
        this.nodeCount = this.nodeCount + element.count;
        if (element.type !== EquipmentType.EmptyNode) {
          this.types.push(element);
          this.equipmentCount = this.equipmentCount + element.count;
        } else {
          this.emptyNodeCount = this.emptyNodeCount + element.count;
        }
      } else {
        this.pointCount = element.count;
      }
    }

    document.getElementById('titleInput')!.focus();
  }

  @Output() closeEvent = new EventEmitter<GeoTrace | null>();

  constructor(private gisMapService: GisMapService, private ts: TranslateService) {}
  ngOnInit(): void {
    document.getElementById('titleInput')!.focus();
  }

  isDisabled() {
    return !this.hasPermission;
  }

  traceTitleValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // if (control.pristine) return null;
      if (control.value === '') return { invalidTitle: { value: 'required' } };
      // еще надо проверить уникальность
      const traces = this.gisMapService
        .getGeoData()
        .traces.filter((t) => t.title === control.value);
      if (traces.length > 1) return { invalidTitle: { value: 'not unique' } };
      if (traces.length === 1 && traces[0].id !== this.trace.id)
        return { invalidTitle: { value: 'not unique' } };
      return null;
    };
  }

  isTraceTitleValid() {
    return this.form.controls['title'].valid;
  }

  onRadioButtonClick(id: number) {
    if (this.isDisabled()) return;

    this.radioButtons.forEach((b) => {
      b.isSelected = b.id === id;
    });
  }

  isApplyDisabled() {
    if (this.form.pristine) return true;
    return !this.isTraceTitleValid();
  }

  onApplyClicked() {
    this.trace.title = this.form.controls['title'].value;
    this.trace.darkMode = this.radioButtons[0].isSelected;
    this.trace.comment = this.form.controls['comment'].value;
    this.form.markAsPristine();
    this.closeEvent.emit(this.trace);
  }
  onDiscardClicked() {
    this.closeEvent.emit(null);
  }
}
