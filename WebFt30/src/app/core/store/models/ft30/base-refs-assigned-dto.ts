import { BaseRefType } from './ft-enums';
import { ReturnCode } from './return-code';

export class BaseRefsAssignedDto {
  returnCode!: ReturnCode;

  baseRefType!: BaseRefType;
  nodes!: number;
  equipments!: number;
  landmarks!: number;

  waveLength!: string | null;
}
