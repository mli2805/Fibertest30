import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState, LatLngFormat, SettingsSelectors } from 'src/app/core';

@Pipe({ name: 'geoCoordinates', pure: false })
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

  transform(value: L.LatLng) {
    const lat = this.oneCoorToString(value.lat, this.latLngFormat);
    const lng = this.oneCoorToString(value.lng, this.latLngFormat);
    return `${lat} : ${lng}`;
  }

  oneCoorToString(value: number, format: LatLngFormat) {
    switch (format) {
      case 'ddd.dddddd°':
        return `${value.toFixed(6)}°`;
      case 'ddd° mm.mmmmm′': {
        const degrees = Math.trunc(value);
        const minutes = (value - degrees) * 60;
        return `${degrees.toString()}° ${minutes.toFixed(5)}′`;
      }
      case 'ddd° mm′ ss.ss″': {
        const degrees = Math.trunc(value);
        const m = (value - degrees) * 60;
        const minutes = Math.trunc(m);
        const seconds = (m - minutes) * 60;
        return `${degrees.toString()}° ${minutes.toString()}′ ${seconds.toFixed(2)}″`;
      }
    }
  }

  ngOnDestroy(): void {
    this.latLngFormatSubscription.unsubscribe();
  }
}
