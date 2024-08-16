import { DistanceMeasParam, UnitMeasParam } from './acceptable-measurement-parameters';

export class FtMeasurementSettings {
  laser!: UnitMeasParam;

  backscatteringCoeff!: string | null;
  refractiveIndex!: string | null;

  distance!: DistanceMeasParam | null;
  pulse!: string | null;
  resolution!: string | null;
  averagingTime!: string | null;
}

export class MeasParamByPosition {
  param!: number;
  position!: number;
}

/* для справки
 public enum ServiceFunctionFirstParam
 {
     Unit = 1,
     Lmax = 2,
     Res = 5,
     Pulse = 6,
     Navr = 7,
     Time = 8,
     IsTime = 9,
     Ri = 10,
     Bc = 11,
*/
