import { MonitoringPortStatus, MonitoringSchedulerMode, NetworkType } from 'src/grpc-generated';
import { MapUtils } from './map.utils';
import { SorReader, SorTrace } from '@veex/sor';
import { LinkMapBase, LinkMapReader } from '@veex/link-map';
import { Color } from '@veex/common';
import {
  MonitoringAlarmType,
  MonitoringChange,
  MonitoringChangeKeyEvent,
  QualifiedValue,
  ValueExactness
} from './store/models';

export class ConvertUtils {
  static monitoringPortStatusToString(status: MonitoringPortStatus): string {
    switch (status) {
      case MonitoringPortStatus.Off:
        return 'i18n.common.off';
      case MonitoringPortStatus.On:
        return 'i18n.common.on';
      case MonitoringPortStatus.Maintenance:
        return 'i18n.common.maintenance';
      default:
        throw new Error(`No matching nameId found for monitoring port status ${status}`);
    }
  }

  static monitoringAlarmTypeToString(type: MonitoringAlarmType): string {
    switch (type) {
      case MonitoringAlarmType.EventLoss:
        return 'i18n.alarm.event-loss';
      case MonitoringAlarmType.TotalLoss:
        return 'i18n.alarm.total-loss';
      case MonitoringAlarmType.EventReflectance:
        return 'i18n.alarm.event-reflectance';
      case MonitoringAlarmType.SectionAttenuation:
        return 'i18n.alarm.section-attenuation';
      case MonitoringAlarmType.SectionLoss:
        return 'i18n.alarm.section-loss';
      case MonitoringAlarmType.SectionLengthChange:
        return 'i18n.alarm.section-length-change';
      case MonitoringAlarmType.PortHealth:
        return 'i18n.alarm.port-health';
      case MonitoringAlarmType.FiberBreak:
        return 'i18n.alarm.fiber-break';
      case MonitoringAlarmType.NewEvent:
        return 'i18n.alarm.new-event';
      case MonitoringAlarmType.NewEventAfterEof:
        return 'i18n.alarm.new-event-after-eof';
      default:
        throw new Error(`No matching nameId found for monitoring alarm type ${type}`);
    }
  }

  static monitoringAlarmTypeToUnits(type: MonitoringAlarmType): string | null {
    switch (type) {
      case MonitoringAlarmType.EventLoss:
      case MonitoringAlarmType.TotalLoss:
      case MonitoringAlarmType.EventReflectance:
      case MonitoringAlarmType.SectionLoss:
        return 'i18n.common.units.dB';
      case MonitoringAlarmType.SectionAttenuation:
        return 'i18n.common.units.dB-km';
      case MonitoringAlarmType.SectionLengthChange:
        return 'i18n.common.units.m';
      case MonitoringAlarmType.PortHealth:
        return 'i18n.common.units.percent';
      case MonitoringAlarmType.FiberBreak:
      case MonitoringAlarmType.NewEvent:
      case MonitoringAlarmType.NewEventAfterEof:
        return null;
      default:
        throw new Error(`No matching unitsId found for monitoring alarm type ${type}`);
    }
  }

  static monitoringChangeEventToValue(
    type: MonitoringAlarmType,
    changeEvent: MonitoringChangeKeyEvent | null
  ): QualifiedValue | number | null {
    if (changeEvent === null) {
      return null;
    }

    switch (type) {
      case MonitoringAlarmType.EventLoss:
        return changeEvent.eventLoss;
      case MonitoringAlarmType.TotalLoss:
        return null;
      case MonitoringAlarmType.EventReflectance:
        return changeEvent.eventReflectance;
      case MonitoringAlarmType.SectionAttenuation:
        return changeEvent.sectionAttenuation;
      case MonitoringAlarmType.SectionLoss:
      case MonitoringAlarmType.SectionLengthChange:
      case MonitoringAlarmType.PortHealth:
      case MonitoringAlarmType.FiberBreak:
      case MonitoringAlarmType.NewEvent:
      case MonitoringAlarmType.NewEventAfterEof:
        return null;
      default:
        throw new Error(`No matching change event value found for monitoring alarm type ${type}`);
    }
  }

  static getThresholdExceedValue(
    type: MonitoringAlarmType,
    change: MonitoringChange
  ): QualifiedValue | number | null {
    if (change.thresholdExcessDelta === null) {
      return null;
    }

    if (type === MonitoringAlarmType.EventReflectance && change.reflectanceExcessDeltaExactness) {
      const qualifiedValue = new QualifiedValue();
      qualifiedValue.value = change.thresholdExcessDelta;
      qualifiedValue.exactness = change.reflectanceExcessDeltaExactness;
      return qualifiedValue;
    }

    return change.thresholdExcessDelta;
  }

  static exactnessToString(exactness: ValueExactness): string | null {
    switch (exactness) {
      case ValueExactness.Exact:
        return null; // dont show anything
      case ValueExactness.AtLeast:
        return 'i18n.common.at-least';
      case ValueExactness.AtMost:
        return 'i18n.common.at-most';
      default:
        throw new Error(`No matching nameId found for value exactness ${exactness}`);
    }
  }

  static scheduleModeToString(mode: MonitoringSchedulerMode) {
    switch (mode) {
      case MonitoringSchedulerMode.RoundRobin:
        return 'i18n.monitoring.schedule-mode-round-robin';
      case MonitoringSchedulerMode.AtLeastOnceIn:
        return 'i18n.monitoring.schedule-mode-at-least-once-in';
      case MonitoringSchedulerMode.FixedTimeSlot:
        return 'i18n.monitoring.schedule-mode-fixed-time-slot';
      default:
        throw new Error(`No matching nameId found for schedule mode ${mode}`);
    }
  }

  static scheduleIntervalToObject(seconds: number) {
    switch (seconds) {
      case 600:
        return { seconds: seconds, value: 10, unit: 'i18n.monitoring.mins' };
      case 1200:
        return { seconds: seconds, value: 20, unit: 'i18n.monitoring.mins' };
      case 1800:
        return { seconds: seconds, value: 30, unit: 'i18n.monitoring.mins' };
      case 3600:
        return { seconds: seconds, value: 1, unit: 'i18n.monitoring.hour' };
      case 7200:
        return { seconds: seconds, value: 2, unit: 'i18n.monitoring.hours' };
      case 10800:
        return { seconds: seconds, value: 3, unit: 'i18n.monitoring.hours' };
      case 21600:
        return { seconds: seconds, value: 6, unit: 'i18n.monitoring.hours' };
      case 43200:
        return { seconds: seconds, value: 12, unit: 'i18n.monitoring.hours' };
      case 86400:
        return { seconds: seconds, value: 1, unit: 'i18n.monitoring.day' };
      default:
        throw new Error(`No matching object found for monitoring interval ${seconds}`);
    }
  }

  static networkTypeToString(type: NetworkType): string {
    switch (type) {
      case NetworkType.PointToPoint:
        return 'i18n.common.measurement.network-type.point-to-point';
      case NetworkType.ManualPON:
        return 'i18n.common.measurement.network-type.manual-pon';
      case NetworkType.AutoPON:
        return 'i18n.common.measurement.network-type.auto-pon';
      case NetworkType.xWDM:
        return 'i18n.common.measurement.network-type.x-wdm';
      case NetworkType.AutoPonToOnt:
        return 'i18n.common.measurement.network-type.auto-pon-to-ont';
      default:
        throw new Error(`No matching nameId found for network type ${type}`);
    }
  }

  static otauTypeToString(type: string): string {
    // If use 'RTU' instead of 'OCM' it's hard to understand that it's about OTAU
    // if (type === 'Ocm') {
    //   return 'RTU';
    // }

    return type;
  }

  static oxcParametersToAddress(oxcParameters: string): string {
    const oxcParam = MapUtils.toOxcOtauParameters(oxcParameters);
    return oxcParam.Ip + ':' + oxcParam.Port;
  }

  static async buildSorTrace(data: Uint8Array | null, color: Color | null = null) {
    if (data == null || data.length === 0) {
      return null;
    }

    const sorData = await new SorReader().fromBytes(data!);
    const sorTrace = new SorTrace(sorData, '', false);
    if (color !== null) {
      sorTrace.chart.color = color;
    }
    return sorTrace;
  }

  static async buildLinkMap(data: Uint8Array | null): Promise<LinkMapBase | null> {
    if (data == null || data.length === 0) {
      return null;
    }

    const linkMap = await new LinkMapReader().fromBytes(data);
    return linkMap;
  }

  static toKmOrM(distaceMeters: number | null): string {
    if (distaceMeters || distaceMeters === 0) {
      if (distaceMeters < 1000) {
        let formatted = distaceMeters.toFixed(2);
        formatted = formatted.replace(/\.00$|0+$/, '');
        return `${formatted}m`;
      }

      let formatted = (distaceMeters / 1000).toFixed(3);
      formatted = formatted.replace(/\.000$|0+$/, '');

      return `${formatted}km`;
    }

    return '';
  }

  static taskTypeToString(taskType: 'ondemand' | 'baseline' | 'monitoring'): string {
    switch (taskType) {
      case 'ondemand':
        return 'i18n.start-page.on-demand';
      case 'baseline':
        return 'i18n.common.baseline';
      case 'monitoring':
        return 'i18n.common.monitoring';
      default:
        throw new Error(`Unknown task type ${taskType}`);
    }
  }

  static getStepNameId(stepName: string | null) {
    if (stepName === null) {
      return null;
    }

    switch (stepName.toLowerCase()) {
      case 'detecting':
        return 'i18n.otdr-task-status.detecting';
      case 'fast':
        return 'i18n.otdr-task-status.measuring-fast';
      default:
        return null;
    }
  }
}
