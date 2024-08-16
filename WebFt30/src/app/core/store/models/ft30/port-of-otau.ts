import { NetAddress } from './net-address';

export class PortOfOtau {
  otauId!: string | undefined;
  otauNetAddress!: NetAddress | undefined;

  otauSerial!: string;
  opticalPort!: number;
  isPortOnMainCharon!: boolean;
  mainCharonPort!: number | undefined;

  rtuId!: string | undefined;
}
