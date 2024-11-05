import { NetAddress } from './net-address';

export class AttachOtauDto {
  rtuId!: string;
  netAddress!: NetAddress;
  opticalPort!: number;
}
