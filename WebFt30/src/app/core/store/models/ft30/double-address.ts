import { NetAddress } from './net-address';

export class DoubleAddress {
  main!: NetAddress;
  hasReserveAddress!: boolean;
  reserve!: NetAddress;
}
