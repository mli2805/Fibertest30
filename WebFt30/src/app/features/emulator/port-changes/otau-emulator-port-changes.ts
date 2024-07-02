// consider using MonitoringChange from application models
export class MonitoringChange {
  Type!: string;
  Level!: string;
  DistanceMeters?: number;
  DistanceThresholdMeters?: number;
}

export class OtauEmulatorPortChanges {
  Enabled!: boolean;
  Changes!: MonitoringChange[];
}

export interface OtauEmulatorPortChangesMap {
  [emulatedOtauId: string]: {
    [portIndex: number]: OtauEmulatorPortChanges;
  };
}
