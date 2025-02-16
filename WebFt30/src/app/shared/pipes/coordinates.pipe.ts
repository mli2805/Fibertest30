import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'coordinatesPipe' })
export class CoordinatesPipe implements PipeTransform {
  transform(coors: L.LatLng) {
    const lat = Math.round(coors.lat * 1000000) / 1000000;
    const lng = Math.round(coors.lng * 1000000) / 1000000;
    return `${lat} : ${lng}`;
  }
}
