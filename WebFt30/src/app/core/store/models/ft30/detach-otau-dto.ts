import { NetAddress } from './net-address';

export class DetachOtauDto {
  rtuId!: string;
  otauId!: string;
  netAddress!: NetAddress;
  opticalPort!: number;
}
