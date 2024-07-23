import * as grpc from 'src/grpc-generated';
import { NetAddress } from '../models/ft30/net-address';
import { PortOfOtau } from '../models/ft30/port-of-otau';
import { retry } from 'rxjs';

export class FtBaseMapping {
  static fromGrpcNetAddress(grpcNetAddress: grpc.NetAddress): NetAddress {
    const netAddress = new NetAddress();
    netAddress.ip4Address = grpcNetAddress.ip4Address;
    netAddress.hostName = grpcNetAddress.hostName;
    netAddress.port = grpcNetAddress.port;
    return netAddress;
  }

  static toGrpcNetAddress(netAddress: NetAddress): grpc.NetAddress {
    return {
      ip4Address: netAddress.ip4Address,
      hostName: netAddress.hostName,
      port: netAddress.port
    };
  }

  static fromGrpcPortOfOtau(grpcPortOfOtau: grpc.PortOfOtau): PortOfOtau {
    const portOfOtau = new PortOfOtau();
    portOfOtau.otauId = grpcPortOfOtau.otauId !== undefined ? grpcPortOfOtau.otauId : null;
    portOfOtau.otauNetAddress = this.fromGrpcNetAddress(grpcPortOfOtau.otauNetAddress!);
    portOfOtau.otauSerial = grpcPortOfOtau.otauSerial;
    portOfOtau.opticalPort = grpcPortOfOtau.opticalPort;
    portOfOtau.isPortOnMainCharon = grpcPortOfOtau.isPortOnMainCharon;
    portOfOtau.mainCharonPort = grpcPortOfOtau.mainCharonPort;
    return portOfOtau;
  }
}
