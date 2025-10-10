import { DoubleAddress } from './double-address';

export class InitializeRtuDto {
  rtuId!: string;
  rtuAddresses!: DoubleAddress;
  isSynchronizationRequired!: boolean;
}
