import * as L from 'leaflet';

enum DecartAxis {
  X,
  Y,
  Z
}

interface DecartCoors {
  X: number;
  Y: number;
  Z: number;
}

class CoorsInRad {
  Lat: number;
  Lng: number;

  // несколько конструкторов нельзя, поэтому такой гибрид
  constructor(p?: L.LatLng | number, lng?: number) {
    if (p instanceof L.LatLng) {
      // Конструктор от LatLng
      this.Lat = (p.lat * Math.PI) / 180;
      this.Lng = (p.lng * Math.PI) / 180;
    } else if (typeof p === 'number' && typeof lng === 'number') {
      // Конструктор от двух чисел
      this.Lat = p;
      this.Lng = lng;
    } else {
      // Пустой конструктор
      this.Lat = 0;
      this.Lng = 0;
    }
  }
}

const EarthRadius = 6372795;

export class GisCalc {
  getDistanceBetweenPointLatLng(p1: L.LatLng, p2: L.LatLng): number {
    const q1 = new CoorsInRad(p1);
    const q2 = new CoorsInRad(p2);
    return this.getDistanceBetweenPoints(q1, q2);
  }

  getDistanceBetweenPoints(q1: CoorsInRad, q2: CoorsInRad): number {
    let decCoors = this.sphereToDecart(q2);
    decCoors = this.rotateAround(decCoors, q1.Lng, DecartAxis.Z);
    decCoors = this.rotateAround(decCoors, Math.PI / 2 - q1.Lat, DecartAxis.Y);
    const q = this.decartToSphere(decCoors);
    const distanceOnSphere = Math.PI / 2 - q.Lat;
    return distanceOnSphere * EarthRadius;
  }

  sphereToDecart(sphere: CoorsInRad): DecartCoors {
    const p = Math.cos(sphere.Lat);
    return {
      Z: Math.sin(sphere.Lat),
      Y: p * Math.sin(sphere.Lng),
      X: p * Math.cos(sphere.Lng)
    };
  }

  decartToSphere(coors: DecartCoors): CoorsInRad {
    const hypot = Math.sqrt(coors.X * coors.X + coors.Y * coors.Y);
    return new CoorsInRad(Math.atan2(coors.Z, hypot), Math.atan2(coors.Y, coors.X));
  }

  rotateAround(coors: DecartCoors, alpha: number, axis: DecartAxis): DecartCoors {
    switch (axis) {
      case DecartAxis.X:
        return {
          X: coors.X,
          Y: coors.Y * Math.cos(alpha) + coors.Z * Math.sin(alpha),
          Z: -coors.Y * Math.sin(alpha) + coors.Z * Math.cos(alpha)
        };
      case DecartAxis.Y:
        return {
          X: -coors.Z * Math.sin(alpha) + coors.X * Math.cos(alpha),
          Y: coors.Y,
          Z: coors.Z * Math.cos(alpha) + coors.X * Math.sin(alpha)
        };
      default: // DecartAxis.Z
        return {
          X: coors.X * Math.cos(alpha) + coors.Y * Math.sin(alpha),
          Y: -coors.X * Math.sin(alpha) + coors.Y * Math.cos(alpha),
          Z: coors.Z
        };
    }
  }
}
