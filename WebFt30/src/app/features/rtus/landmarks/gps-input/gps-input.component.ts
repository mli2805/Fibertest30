import * as L from 'leaflet';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, SettingsSelectors } from 'src/app/core';
import { OneCoorInputComponent } from '../one-coor-input/one-coor-input.component';

@Component({
  selector: 'rtu-gps-input',
  templateUrl: './gps-input.component.html',
  styleUrls: ['./gps-input.component.scss']
})
export class GpsInputComponent {
  private store: Store<AppState> = inject(Store<AppState>);
  latLngFormatName$ = this.store.select(SettingsSelectors.selectLanLngFormatName);

  @ViewChild('latInput') latInput!: OneCoorInputComponent;
  @ViewChild('lngInput') lngInput!: OneCoorInputComponent;

  originalValue!: L.LatLng;

  @Input() set coors(value: L.LatLng) {
    this.originalValue = value;
  }

  @Output() previewClick = new EventEmitter<L.LatLng>();

  preview() {
    const latitude = this.latInput.getInput();
    if (!latitude) return;
    const longitude = this.lngInput.getInput();
    if (!longitude) return;
    const coordinate = new L.LatLng(latitude, longitude);

    this.previewClick.next(coordinate);
  }

  cancel() {
    this.previewClick.next(this.originalValue);
  }
}
