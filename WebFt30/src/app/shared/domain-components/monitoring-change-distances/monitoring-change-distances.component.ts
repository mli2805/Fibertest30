import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import {
  MonitoringAlarmLevel,
  MonitoringAlarmType,
  MonitoringChange
} from 'src/app/core/store/models';

@Component({
  selector: 'rtu-monitoring-changes-distances',
  templateUrl: 'monitoring-change-distances.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringChangeDistancesComponent {
  convertUtils = ConvertUtils;

  @Input() change!: MonitoringChange;

  //   change: MonitoringChange = {
  //     type: MonitoringAlarmType.EventLoss,
  //     level: MonitoringAlarmLevel.Critical,
  //     threshold: 0.5,
  //     thresholdExcessDelta: 0.1,
  //     distanceThresholdMeters: 0.5,
  //     reflectanceExcessDeltaExactness: 0,
  //     distanceMeters: 2000,
  //     current: null,
  //     baseline: null,
  //     baselineLeft: {
  //       keyEventIndex: 0,
  //       distanceMeters: 1923,
  //       eventLoss: 0.5,
  //       eventReflectance: null,
  //       sectionAttenuation: 0.5,
  //       isClipped: true,
  //       isReflective: false,
  //       comment: 'Landmark A'
  //     },
  //     // baselineRight: null
  //     baselineRight: {
  //       keyEventIndex: 0,
  //       distanceMeters: 30000,
  //       eventLoss: 0.5,
  //       eventReflectance: null,
  //       sectionAttenuation: 0.5,
  //       isClipped: true,
  //       isReflective: false,
  //       comment: 'Landmark B'
  //     }
  //   };
}
