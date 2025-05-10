import {
  AccidentPlace,
  BaseRefType,
  EventStatus,
  FiberState,
  OpticalAccidentType
} from './ft-enums';

export class OpticalEvent {
  eventId!: number;
  measuredAt!: Date;
  registeredAt!: Date;

  rtuTitle!: string;
  rtuId!: string;
  traceTitle!: string;
  traceId!: string;

  baseRefType!: BaseRefType;
  traceState!: FiberState;

  eventStatus!: EventStatus;
  statusChangedAt!: Date;
  statusChangedByUser!: string;

  comment!: string;

  accidents!: AccidentOnTraceV2[];
}

export class AccidentOnTraceV2 {
  brokenRftsEventNumber!: number;
  accidentSeriousness!: FiberState;
  opticalTypeOfAccident!: OpticalAccidentType;

  isAccidentInOldEvent!: boolean;
  isAccidentInLastNode!: boolean;
  accidentCoors!: L.LatLng;

  accidentLandmarkIndex!: number;
  accidentToRtuOpticalDistanceKm!: number;
  accidentTitle!: string;
  accidentToRtuPhysicalDistanceKm!: number;

  accidentToLeftOpticalDistanceKm!: number;
  accidentToLeftPhysicalDistanceKm!: number;
  accidentToRightOpticalDistanceKm!: number;
  accidentToRightPhysicalDistanceKm!: number;

  eventCode!: string;
  deltaLen!: number;

  left!: AccidentNeighbour;
  right!: AccidentNeighbour;
}

export class AccidentNeighbour {
  landmarkIndex!: number;
  title!: string;
  coors!: L.LatLng;
  toRtuOpticalDistanceKm!: number;
  toRtuPhysicalDistanceKm!: number;
}

export class AccidentLine {
  caption!: string;

  numberOfAccident!: number;
  accidentSeriousness!: FiberState;
  accidentTypeLetter!: string;
  accidentTypeWords!: string;
  accidentPlace!: AccidentPlace;

  scheme!: string;

  topLeft = '';
  topCenter = '';
  topRight = '';
  bottom0 = '';
  bottom1 = '';
  position!: L.LatLng;
  bottom3 = '';
  bottom4 = '';
}
