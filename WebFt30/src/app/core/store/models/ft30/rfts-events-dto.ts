import { EquipmentType } from 'src/grpc-generated';
import { FiberState } from './ft-enums';

export class GetRftsEventsRequest {
  sorFileId!: number;
}

export class GetRftsEventsResponse {
  rftsEvents!: RftsEvents;
}

export class RftsEvents {
  errorMessage!: string;
  isNoFiber!: boolean;
  levelArray!: RftsLevel[];
  summary!: RftsEventsSummary;
}

export class RftsLevel {
  level!: FiberState;
  isFailed!: boolean;
  firstProblemLocation!: string;
  eventArray!: RftsEvent[];
  totalFiberLoss!: TotalFiberLoss;
}

export class RftsEvent {
  ordinal!: number;
  isNew!: boolean;
  isFailed!: boolean;
  landmarkTitle!: string;
  landmarkType!: EquipmentType;
  state!: string;
  damageType!: string;
  distanceKm!: string;
  enabled!: string;
  eventType!: string;
  reflectanceCoeff!: string;
  attenuationInClosure!: string;
  attenuationCoeff!: string;
  reflectanceCoeffThreshold!: MonitoringThreshold | null;
  attenuationInClosureThreshold!: MonitoringThreshold | null;
  attenuationCoeffThreshold!: MonitoringThreshold | null;
  reflectanceCoeffDeviation!: string;
  attenuationInClosureDeviation!: string;
  attenuationCoeffDeviation!: string;
}

export class TotalFiberLoss {
  value!: number;
  threshold!: MonitoringThreshold;
  deviation!: number;
  isPassed!: boolean;
}

export class MonitoringThreshold {
  value!: number;
  isAbsolute!: boolean;
}

export class RftsEventsSummary {
  traceState!: FiberState;
  breakLocation!: number;
  orl!: number;
  levelStates!: LevelState[];
}

export class LevelState {
  levelTitle!: string;
  state!: string;
}
