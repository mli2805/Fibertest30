import { FiberState, TceLinkState } from './ft-enums';
import { PortOfOtau } from './port-of-otau';

export class Trace {
  traceId!: string;
  rtuId!: string;
  title!: string;
  port!: PortOfOtau | null;
  isAttached!: boolean;
  state!: FiberState;
  hasEnoughBaseRefsToPerformMonitoring!: boolean;
  isIncludedInMonitoringCycle!: boolean;
  tceLinkState!: TceLinkState;
}
