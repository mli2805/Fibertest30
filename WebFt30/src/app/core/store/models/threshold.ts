export enum ThresholdParameter {
  EventLoss = 0,
  TotalLoss = 1,
  EventReflectance = 2,
  SectionAttenuation = 3,
  SectionLoss = 4,
  SectionLengthChange = 5,
  PortHealth = 6
}

export class Threshold {
  id!: number;
  parameter: ThresholdParameter;

  isMinorOn = false;
  minor: number | null = null;
  isMajorOn = false;
  major: number | null = null;
  isCriticalOn = false;
  critical: number | null = null;

  constructor(param: ThresholdParameter) {
    this.parameter = param;
  }

  // enabled/disabled threshold generally
  public isOn(): boolean {
    if (this.isMinorOn || this.isMajorOn || this.isCriticalOn) return true;
    return false;
  }
}
