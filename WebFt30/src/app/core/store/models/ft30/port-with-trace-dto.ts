import { FiberState } from './ft-enums';
import { PortOfOtau } from './port-of-otau';
import { ReturnCode } from './return-code';

export class PortWithTraceDto {
  traceId!: string;
  portOfOtau!: PortOfOtau;
  lastTraceState!: FiberState;
  lastRtuAccidentOnTrace!: ReturnCode;
}
