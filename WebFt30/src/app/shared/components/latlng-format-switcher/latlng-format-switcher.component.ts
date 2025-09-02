import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  AppState,
  LatLngFormat,
  LatLngFormats,
  SettingsActions,
  SettingsSelectors
} from 'src/app/core';

@Component({
    selector: 'rtu-latlng-format-switcher',
    templateUrl: './latlng-format-switcher.component.html',
    standalone: false
})
export class LatlngFormatSwitcherComponent {
  public store: Store<AppState> = inject(Store);

  public latLngFormats = <any>LatLngFormats;
  public selectedLatLngFormat$: Observable<LatLngFormat>;

  constructor() {
    this.selectedLatLngFormat$ = this.store.select(SettingsSelectors.selectLatLngFormat);
  }

  setLatLngFormat(latLngFormat: LatLngFormat) {
    this.store.dispatch(SettingsActions.changeLatLngFormat({ latLngFormat }));
  }
}
