import { NetAddress } from './net-address';

export class PortOfOtau {
  otauId!: string | null;
  otauNetAddress!: NetAddress;
  otauSerial!: string;

  opticalPort!: number;
  isPortOnMainCharon!: boolean;
  mainCharonPort!: number;
}
