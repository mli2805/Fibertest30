import { Pipe, PipeTransform } from '@angular/core';
import { ThresholdParameter } from 'src/app/core/store/models/threshold';

@Pipe({
  name: 'thresholdUnit',
  pure: true
})
export class ThresholdUnitPipe implements PipeTransform {
  transform(parameter: any, ...args: any[]) {
    switch (parameter) {
      case ThresholdParameter.EventLoss:
      case ThresholdParameter.EventReflectance:
      case ThresholdParameter.TotalLoss:
      case ThresholdParameter.SectionLoss:
        return 'i18n.common.units.dB';
      case ThresholdParameter.SectionAttenuation:
        return 'i18n.common.units.dB-km';
      case ThresholdParameter.SectionLengthChange:
        return 'i18n.common.units.m';
      case ThresholdParameter.PortHealth:
        return 'i18n.common.units.percent';
    }
    return '';
  }
}
