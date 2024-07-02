import {
  MonitoringAlarmLevel,
  MonitoringAlarmType,
  MonitoringChange,
  MonitoringChangeKeyEvent,
  QualifiedValue,
  ValueExactness
} from './store/models';

export class MapJsonUtils {
  // rawChange has type MonitoringChange
  // but it's a trick to get properties autocomplete
  // the props in json and in MonitoringChange should be the same (server even create json with camelCase props)
  // but we need to create proper types & enums anyway

  // same for other types

  static fromJsonToChanges(jsonChanges: string | null): MonitoringChange[] | null {
    if (jsonChanges == null) {
      return null;
    }

    const raw: MonitoringChange[] = JSON.parse(jsonChanges);

    return raw.map((rawChange: MonitoringChange) => {
      return MapJsonUtils.fromRawJsonToChange(rawChange);
    });
  }

  static fromJsonToChange(jsonChange: string): MonitoringChange {
    const rawChange: MonitoringChange = JSON.parse(jsonChange);
    return MapJsonUtils.fromRawJsonToChange(rawChange);
  }

  private static fromRawJsonToChange(rawChange: MonitoringChange): MonitoringChange {
    const change = new MonitoringChange();
    change.type = MonitoringAlarmType[(<any>rawChange.type) as keyof typeof MonitoringAlarmType];
    change.level =
      MonitoringAlarmLevel[(<any>rawChange.level) as keyof typeof MonitoringAlarmLevel];
    change.distanceMeters = rawChange.distanceMeters ?? null;
    change.distanceThresholdMeters = rawChange.distanceThresholdMeters ?? null;
    change.threshold = rawChange.threshold ?? null;
    change.thresholdExcessDelta = rawChange.thresholdExcessDelta ?? null;
    change.reflectanceExcessDeltaExactness = rawChange.reflectanceExcessDeltaExactness
      ? ValueExactness[
          (<any>rawChange.reflectanceExcessDeltaExactness!) as keyof typeof ValueExactness
        ]
      : null;

    change.current = MapJsonUtils.fromJsonToChangeKeyEvent(rawChange.current ?? null);
    change.baseline = MapJsonUtils.fromJsonToChangeKeyEvent(rawChange.baseline ?? null);
    change.baselineLeft = MapJsonUtils.fromJsonToChangeKeyEvent(rawChange.baselineLeft ?? null);
    change.baselineRight = MapJsonUtils.fromJsonToChangeKeyEvent(rawChange.baselineRight ?? null);

    return change;
  }

  static fromJsonToChangeKeyEvent(
    rawChangeKeyEvent: MonitoringChangeKeyEvent | null
  ): MonitoringChangeKeyEvent | null {
    if (!rawChangeKeyEvent) {
      return null;
    }

    const changeKeyEvent = new MonitoringChangeKeyEvent();
    changeKeyEvent.keyEventIndex = rawChangeKeyEvent.keyEventIndex;
    changeKeyEvent.distanceMeters = rawChangeKeyEvent.distanceMeters;
    changeKeyEvent.eventLoss = rawChangeKeyEvent.eventLoss || null;
    changeKeyEvent.eventReflectance = !rawChangeKeyEvent.eventReflectance
      ? null
      : MapJsonUtils.fromJsonToQualifiedValue(rawChangeKeyEvent.eventReflectance);
    changeKeyEvent.sectionAttenuation = rawChangeKeyEvent.sectionAttenuation || null;
    changeKeyEvent.isClipped = rawChangeKeyEvent.isClipped || null;
    changeKeyEvent.isReflective = rawChangeKeyEvent.isReflective || null;
    changeKeyEvent.comment = rawChangeKeyEvent.comment;

    return changeKeyEvent;
  }

  static fromJsonToQualifiedValue(rawQualifiedValue: QualifiedValue): QualifiedValue {
    const qualifiedValue = new QualifiedValue();
    qualifiedValue.value = rawQualifiedValue.value;
    qualifiedValue.exactness =
      ValueExactness[(<any>rawQualifiedValue.exactness) as keyof typeof ValueExactness];
    return qualifiedValue;
  }
}
