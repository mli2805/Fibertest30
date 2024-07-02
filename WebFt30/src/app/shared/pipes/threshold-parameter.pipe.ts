import { Pipe, PipeTransform } from '@angular/core';
import { ThresholdParameter } from 'src/app/core/store/models/threshold';

@Pipe({
  name: 'thresholdName',
  pure: true
})
export class ThresholdParameterPipe implements PipeTransform {
  transform(parameter: any, ...args: any[]) {
    switch (parameter) {
      case ThresholdParameter.EventLoss:
        return 'i18n.alarm.event-loss';
      case ThresholdParameter.TotalLoss:
        return 'i18n.alarm.total-loss';
      case ThresholdParameter.EventReflectance:
        return 'i18n.alarm.event-reflectance';
      case ThresholdParameter.SectionAttenuation:
        return 'i18n.alarm.section-attenuation';
      case ThresholdParameter.SectionLoss:
        return 'i18n.alarm.section-loss';
      case ThresholdParameter.SectionLengthChange:
        return 'i18n.alarm.section-length-change';
      case ThresholdParameter.PortHealth:
        return 'i18n.alarm.port-health';
    }
    return '';
  }
}
