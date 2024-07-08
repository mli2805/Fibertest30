import { Bop } from './bop';
import { RtuPartState, MonitoringState } from './ft-enums';
import { Trace } from './trace';

export class Rtu {
  rtuId!: string;
  title!: string;

  mainChannelState!: RtuPartState;
  reserveChannelState!: RtuPartState;
  monitoringMode!: MonitoringState;
  ownPortCount!: number;

  bops!: Bop[];
  traces!: Trace[];

  children!: any[];
}
