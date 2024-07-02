export class DistanceRange {
  name!: string;
  pulseDurations!: string[];
  averagingTimes!: string[];
  liveAveragingTimes!: string[];
  resolutions!: string[];
}

export class LaserUnit {
  name!: string;
  distanceRanges!: DistanceRange[];
}

export class OtdrMeasurementParameters {
  laserUnits!: LaserUnit[];
}
