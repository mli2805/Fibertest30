import { RtuPartState } from './ft-enums';
import { NetAddress } from './net-address';
import { Trace } from './trace';

export class Bop {
  bopId!: string;
  rtuId!: string;
  bopNetAddress!: NetAddress;
  masterPort!: number;
  isOk!: boolean;
  bopState!: RtuPartState;
  serial!: string;
  portCount!: number;

  traces!: Trace[];

  children!: any[];
}
