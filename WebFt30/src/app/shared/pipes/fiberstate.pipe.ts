import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

@Injectable({ providedIn: 'root' })
@Pipe({
    name: 'fiberStatePipe',
    standalone: false
})
export class FiberStatePipe implements PipeTransform {
  transform(value: FiberState) {
    switch (value) {
      case FiberState.NotInTrace:
        return 'i18n.ft.not-in-trace';
      case FiberState.NotJoined:
        return 'i18n.ft.not-joined';
      case FiberState.Unknown:
        return 'i18n.ft.unknown';
      case FiberState.NotInZone:
        return 'i18n.ft.not-in-zone';
      case FiberState.Ok:
        return 'i18n.ft.ok';
      case FiberState.Suspicion:
        return 'i18n.ft.suspicion';
      case FiberState.Minor:
        return 'i18n.ft.minor';
      case FiberState.Major:
        return 'i18n.ft.major';
      case FiberState.Critical:
        return 'i18n.ft.critical';
      case FiberState.User:
        return 'i18n.ft.user';
      case FiberState.FiberBreak:
        return 'i18n.ft.fiber-break';
      case FiberState.NoFiber:
        return 'i18n.ft.no-fiber';
      case FiberState.HighLighted:
        return 'i18n.ft.high-lighted';
      case FiberState.DistanceMeasurement:
        return 'i18n.ft.distance-measurement';
      case FiberState.Nothing:
        return 'i18n.ft.nothing';
    }
  }
}
