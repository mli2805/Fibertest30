import { Pipe, PipeTransform } from '@angular/core';
import { BaseRefType, FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';

@Pipe({ name: 'opticalTraceStatePipe' })
export class OpticalTraceStatePipe implements PipeTransform {
  transform(value: OpticalEvent) {
    if (value.baseRefType === BaseRefType.Fast) return 'i18n.ft.suspicion';
    switch (value.traceState) {
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
