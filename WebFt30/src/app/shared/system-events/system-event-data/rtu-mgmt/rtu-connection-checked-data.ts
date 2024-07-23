import { NetAddress } from 'src/app/core/store/models/ft30/net-address';

export interface RtuConnectionCheckedData {
  NetAddress: NetAddress;
  IsSuccessful: boolean;
}
