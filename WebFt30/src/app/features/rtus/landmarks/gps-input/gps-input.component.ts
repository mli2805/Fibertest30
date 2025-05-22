import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, SettingsSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-gps-input',
  templateUrl: './gps-input.component.html',
  styleUrls: ['./gps-input.component.scss']
})
export class GpsInputComponent {
  private store: Store<AppState> = inject(Store<AppState>);
  latLngFormatName$ = this.store.select(SettingsSelectors.selectLanLngFormatName);

  lat!: number;
  lng!: number;

  @Input() set coors(value: L.LatLng) {
    this.lat = value.lat;
    this.lng = value.lng;
  }

  @Output() previewEvent = new EventEmitter();

  preview() {
    //
  }

  cancel() {
    //
  }
}
