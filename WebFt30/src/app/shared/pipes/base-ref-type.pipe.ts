import { Pipe, PipeTransform } from '@angular/core';
import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';

@Pipe({ name: 'baseRefTypePipe' })
export class BaseRefTypePipe implements PipeTransform {
  transform(value: BaseRefType) {
    switch (value) {
      case BaseRefType.Precise:
        return 'i18n.ft.precise';
      case BaseRefType.Fast:
        return 'i18n.ft.fast';
      case BaseRefType.Additional:
        return 'i18n.ft.additional';
      default:
        return 'i18n.ft.unknonw';
    }
  }
}
