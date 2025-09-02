import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, LatLngFormat, SettingsSelectors } from 'src/app/core';

@Pipe({
    name: 'geoCoordinates', pure: false,
    standalone: false
})
export class GeoCoordinatesPipe implements PipeTransform, OnDestroy {
  private latLngFormatSubscription: Subscription;

  private latLngFormat!: LatLngFormat;

  constructor(private store: Store<AppState>) {
    this.latLngFormatSubscription = this.store
      .select(SettingsSelectors.selectLatLngFormat)
      .subscribe((latLngFormat) => {
        this.latLngFormat = latLngFormat;
      });
  }

  transform(value: L.LatLng, spaces = true) {
    const lat = this.oneCoorToString(value.lat, this.latLngFormat, spaces);
    const lng = this.oneCoorToString(value.lng, this.latLngFormat, spaces);
    return `${lat} : ${lng}`;
  }

  oneCoorToString(value: number, format: LatLngFormat, spaces: boolean) {
    switch (format) {
      case 'ddd.dddddd°':
        return `${value.toFixed(6)}°`;
      case 'ddd° mm.mmmmm′': {
        const degrees = Math.trunc(value);
        const minutes = (value - degrees) * 60;
        return `${degrees.toString()}° ${minutes.frmt(2, 5)}′`;
      }
      case 'ddd° mm′ ss.ss″': {
        const degrees = Math.trunc(value);
        const m = (value - degrees) * 60;
        const minutes = Math.trunc(m);
        const seconds = (m - minutes) * 60;
        return spaces
          ? `${degrees.toString()}° ${minutes.frmt(2, 0)}′ ${seconds.frmt(2, 2)}″`
          : `${degrees.toString()}°${minutes.frmt(2, 0)}′${seconds.frmt(2, 2)}″`;
      }
    }
  }

  ngOnDestroy(): void {
    this.latLngFormatSubscription.unsubscribe();
  }
}
