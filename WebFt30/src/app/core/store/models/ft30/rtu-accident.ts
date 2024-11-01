import { BaseRefType } from './ft-enums';
import { ReturnCode } from './return-code';

export class RtuAccident {
  id!: number;
  isMeasurementProblem!: boolean;
  returnCode!: ReturnCode;

  registeredAt!: Date;
  rtuTitle!: string;
  rtuId!: string;
  traceTitle!: string;
  traceId!: string;
  baseRefType!: BaseRefType;

  comment!: string;
  clearedAccidentWithId!: number;
}
