import * as L from 'leaflet';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, SettingsSelectors } from 'src/app/core';
import { OneCoorInputComponent } from '../one-coor-input/one-coor-input.component';

@Component({
  selector: 'rtu-gps-input',
  templateUrl: './gps-input.component.html'
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

  isPreviewDisabled() {
    if (!this.latInput || !this.lngInput) return true;
    return this.latInput.isApplyDisabled() && this.lngInput.isApplyDisabled();
  }

  preview() {
    const coordinate = this.getInput();
    if (coordinate) this.previewClick.next(coordinate);
  }

  getInput() {
    const latitude = this.latInput.getInput();
    if (!latitude) return;
    const longitude = this.lngInput.getInput();
    if (!longitude) return;
    return new L.LatLng(latitude, longitude);
  }

  isCancelDisabled() {
    if (!this.latInput || !this.lngInput) return true;
    return this.latInput.isCancelDisabled() && this.lngInput.isCancelDisabled();
  }

  cancel() {
    this.previewClick.next(this.originalValue);
    this.latInput.initializeForm(this.originalValue.lat);
    this.lngInput.initializeForm(this.originalValue.lng);
  }
}
