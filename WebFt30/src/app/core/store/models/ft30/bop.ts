import { NetAddress } from './net-address';
import { Trace } from './trace';

export class Bop {
  bopId!: string;
  rtuId!: string;
  bopNetAddress!: NetAddress;
  masterPort!: number;
  isOk!: boolean;
  serial!: string;
  portCount!: number;

  traces!: Trace[];
}
