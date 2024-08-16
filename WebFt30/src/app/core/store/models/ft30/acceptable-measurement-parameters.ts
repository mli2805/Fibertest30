export class LeafOfAcceptableMeasParams {
  resolutions!: string[];
  pulseDurations!: string[];
  periodsToAverage!: string[];
  measCountsToAverage!: string[];
}

export class DistanceMeasParam {
  distance!: string;
  otherParams!: LeafOfAcceptableMeasParams;
}

export class BranchOfAcceptableMeasParams {
  distances!: DistanceMeasParam[];
  backscatterCoeff!: number;
  refractiveIndex!: number;
}

export class UnitMeasParam {
  unit!: string;
  branch!: BranchOfAcceptableMeasParams;
}

export class TreeOfAcceptableMeasurementParameters {
  units!: UnitMeasParam[];
}
