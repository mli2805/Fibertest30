import { Pipe, PipeTransform } from '@angular/core';
import { RtuPartState } from 'src/app/core/store/models/ft30/ft-enums';

@Pipe({
    name: 'rtuPartStatePipe',
    standalone: false
})
export class RtuPartStatePipe implements PipeTransform {
  transform(value: RtuPartState, ...args: any[]) {
    switch (value) {
      case RtuPartState.Broken:
        return 'i18n.ft.broken';
      case RtuPartState.NotSetYet:
        return 'i18n.ft.not-set';
      case RtuPartState.Ok:
        return 'i18n.ft.ok';
    }
  }
}
