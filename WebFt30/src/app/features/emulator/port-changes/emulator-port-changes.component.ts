import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  MonitoringChange,
  OtauEmulatorPortChanges,
  OtauEmulatorPortChangesMap
} from './otau-emulator-port-changes';
import { OtauEmulatorConfig } from '../emulator/otau-emulator-config';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { MonitoringAlarmLevel } from 'src/app/core/store/models';

export enum EmulatorPortChangeType {
  None,
  FiberBreak,
  NewEvent,
  EventLossCritical,
  EventReflectanceCritical,
  SectionAttenuationCritical,
  EventLossMajor,
  EventReflectanceMajor,
  SectionAttenuationMajor,
  EventLossMinor,
  EventReflectanceMinor,
  SectionAttenuationMinor,
  NewEventAfterEof
}

@Component({
  selector: 'rtu-emulator-port-changes',
  templateUrl: 'emulator-port-changes.component.html',
  styles: [
    `
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmulatorPortChangesComponent {
  objectKeys = Object.keys;

  portChangeTypes: EmulatorPortChangeType[];
  levels = MonitoringAlarmLevel;

  @Input() portChanges!: OtauEmulatorPortChangesMap;
  @Input() otauConfig!: OtauEmulatorConfig;
  @Output() configChange: EventEmitter<OtauEmulatorPortChangesMap> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {
    this.portChangeTypes = Object.values(EmulatorPortChangeType).filter(
      (value) => typeof value === 'number'
    ) as EmulatorPortChangeType[];
  }

  normalizeEnulatedOtauId(emulatedOtauId: string): string {
    const otauType = emulatedOtauId.slice(0, -1);
    const ocmPort = emulatedOtauId.slice(-1);

    if (ocmPort === '0') {
      return otauType;
    }

    return `${otauType} ${ocmPort}`;
  }

  changeChanged(
    selectComponent: SelectComponent,
    newValue: EmulatorPortChangeType,
    portChange: OtauEmulatorPortChanges,
    distance: number
  ) {
    const changeIndex = portChange.Changes.findIndex((x) => x.DistanceMeters === distance);

    if (newValue === EmulatorPortChangeType.FiberBreak) {
      const fiberBreakIndex = portChange.Changes.findIndex((x) => x.Type === 'FiberBreak');
      if (fiberBreakIndex !== -1 && fiberBreakIndex !== changeIndex) {
        // trying to add fiber break when it's already there
        selectComponent.resetToCurrentSelectedItemInput();
        return;
      }

      // // remove all changes after fiber break
      // portChange.Changes = portChange.Changes.filter((x) => x.DistanceMeters! <= distance);
    }

    if (changeIndex !== -1) {
      // remove previouos
      portChange.Changes.splice(changeIndex, 1);
    }

    if (newValue !== EmulatorPortChangeType.None) {
      // add new
      const newChange = this.emulatorPortChangeTypeToChange(newValue, distance);
      portChange.Changes.push(newChange);
    }

    this.configChange.emit(this.portChanges);
  }

  isAfterFiberBreak(portChange: OtauEmulatorPortChanges, distance: number): boolean {
    const fiberBreak = portChange.Changes.find((x) => x.Type === 'FiberBreak');
    if (!fiberBreak) {
      return false;
    }

    return fiberBreak.DistanceMeters! < distance;
  }

  findSelection(portChange: OtauEmulatorPortChanges, distance: number) {
    const change = portChange.Changes.find((x) => x.DistanceMeters === distance);
    if (change) {
      const changeType = this.portChangeTypes.find(
        (x) => x === this.changeToEmulatorPortChangeType(change)
      );
      if (changeType) {
        return changeType;
      }
    }

    return EmulatorPortChangeType.None;
  }

  toggleEnabled(portChange: OtauEmulatorPortChanges) {
    portChange.Enabled = !portChange.Enabled;
    this.configChange.emit(this.portChanges);
  }

  changeToEmulatorPortChangeType(change: MonitoringChange): EmulatorPortChangeType {
    switch (change.Type) {
      case 'FiberBreak':
        return EmulatorPortChangeType.FiberBreak;
      case 'EventLoss':
        switch (change.Level) {
          case 'Critical':
            return EmulatorPortChangeType.EventLossCritical;
          case 'Major':
            return EmulatorPortChangeType.EventLossMajor;
          case 'Minor':
            return EmulatorPortChangeType.EventLossMinor;
        }
        break;
      case 'EventReflectance':
        switch (change.Level) {
          case 'Critical':
            return EmulatorPortChangeType.EventReflectanceCritical;
          case 'Major':
            return EmulatorPortChangeType.EventReflectanceMajor;
          case 'Minor':
            return EmulatorPortChangeType.EventReflectanceMinor;
        }
        break;
      case 'SectionAttenuation':
        switch (change.Level) {
          case 'Critical':
            return EmulatorPortChangeType.SectionAttenuationCritical;
          case 'Major':
            return EmulatorPortChangeType.SectionAttenuationMajor;
          case 'Minor':
            return EmulatorPortChangeType.SectionAttenuationMinor;
        }
        break;
      case 'NewEvent':
        return EmulatorPortChangeType.NewEvent;
      case 'NewEventAfterEof':
        return EmulatorPortChangeType.NewEventAfterEof;
    }

    throw new Error('Unknown change type');
  }

  emulatorPortChangeTypeToNameLevel(value: EmulatorPortChangeType): {
    name: string;
    level: MonitoringAlarmLevel | null;
    showLevel: boolean;
  } {
    switch (value) {
      case EmulatorPortChangeType.None:
        return { name: '-', level: null, showLevel: false };
      case EmulatorPortChangeType.FiberBreak:
        return { name: 'Fiber Break', level: MonitoringAlarmLevel.Critical, showLevel: false };
      case EmulatorPortChangeType.EventLossCritical:
        return { name: 'Event Loss', level: MonitoringAlarmLevel.Critical, showLevel: true };
      case EmulatorPortChangeType.EventLossMajor:
        return { name: 'Event Loss', level: MonitoringAlarmLevel.Major, showLevel: true };
      case EmulatorPortChangeType.EventLossMinor:
        return { name: 'Event Loss', level: MonitoringAlarmLevel.Minor, showLevel: true };
      case EmulatorPortChangeType.EventReflectanceCritical:
        return { name: 'Event Reflectance', level: MonitoringAlarmLevel.Critical, showLevel: true };
      case EmulatorPortChangeType.EventReflectanceMajor:
        return { name: 'Event Reflectance', level: MonitoringAlarmLevel.Major, showLevel: true };
      case EmulatorPortChangeType.EventReflectanceMinor:
        return { name: 'Event Reflectance', level: MonitoringAlarmLevel.Minor, showLevel: true };
      case EmulatorPortChangeType.SectionAttenuationCritical:
        return {
          name: 'Section Attenuation',
          level: MonitoringAlarmLevel.Critical,
          showLevel: true
        };
      case EmulatorPortChangeType.SectionAttenuationMajor:
        return { name: 'Section Attenuation', level: MonitoringAlarmLevel.Major, showLevel: true };
      case EmulatorPortChangeType.SectionAttenuationMinor:
        return { name: 'Section Attenuation', level: MonitoringAlarmLevel.Minor, showLevel: true };
      case EmulatorPortChangeType.NewEvent:
        return { name: 'New Event', level: MonitoringAlarmLevel.Critical, showLevel: false };
      case EmulatorPortChangeType.NewEventAfterEof:
        return {
          name: 'New Event After EOF',
          level: MonitoringAlarmLevel.Critical,
          showLevel: false
        };
    }
  }

  emulatorPortChangeTypeToChange(
    value: EmulatorPortChangeType,
    distance: number
  ): MonitoringChange {
    switch (value) {
      case EmulatorPortChangeType.FiberBreak:
        return this.createMonitoringChange('FiberBreak', 'Critical', distance);
      case EmulatorPortChangeType.EventLossCritical:
        return this.createMonitoringChange('EventLoss', 'Critical', distance);
      case EmulatorPortChangeType.EventLossMajor:
        return this.createMonitoringChange('EventLoss', 'Major', distance);
      case EmulatorPortChangeType.EventLossMinor:
        return this.createMonitoringChange('EventLoss', 'Minor', distance);
      case EmulatorPortChangeType.EventReflectanceCritical:
        return this.createMonitoringChange('EventReflectance', 'Critical', distance);
      case EmulatorPortChangeType.EventReflectanceMajor:
        return this.createMonitoringChange('EventReflectance', 'Major', distance);
      case EmulatorPortChangeType.EventReflectanceMinor:
        return this.createMonitoringChange('EventReflectance', 'Minor', distance);
      case EmulatorPortChangeType.SectionAttenuationCritical:
        return this.createMonitoringChange('SectionAttenuation', 'Critical', distance);
      case EmulatorPortChangeType.SectionAttenuationMajor:
        return this.createMonitoringChange('SectionAttenuation', 'Major', distance);
      case EmulatorPortChangeType.SectionAttenuationMinor:
        return this.createMonitoringChange('SectionAttenuation', 'Minor', distance);
      case EmulatorPortChangeType.NewEvent:
        return this.createMonitoringChange('NewEvent', 'Critical', distance);
      case EmulatorPortChangeType.NewEventAfterEof:
        return this.createMonitoringChange('NewEventAfterEof', 'Critical', distance);
    }

    throw new Error('Unknown EmulatorPortChangeType type');
  }

  private createMonitoringChange(type: string, level: string, distance: number): MonitoringChange {
    const monitoringChange = new MonitoringChange();
    monitoringChange.Type = type;
    monitoringChange.Level = level;
    monitoringChange.DistanceMeters = distance;
    monitoringChange.DistanceThresholdMeters = 70;
    return monitoringChange;
  }
}
