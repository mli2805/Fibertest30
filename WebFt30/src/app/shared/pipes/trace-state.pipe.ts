import { Pipe, PipeTransform } from '@angular/core';
import { BaseRefType, FiberState } from 'src/app/core/store/models/ft30/ft-enums';

@Pipe({ name: 'traceStatePipe' })
export class TraceStatePipe implements PipeTransform {
  transform(traceState: FiberState, baseRefType: BaseRefType) {
    if (baseRefType === BaseRefType.Fast) return 'i18n.ft.suspicion';
    switch (traceState) {
      case FiberState.Ok:
        return 'i18n.ft.ok';
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
    }
    return 'i18n.ft.unknown';
  }
}
