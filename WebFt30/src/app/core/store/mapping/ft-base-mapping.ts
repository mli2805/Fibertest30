import * as grpc from 'src/grpc-generated';
import { NetAddress } from '../models/ft30/net-address';
import { PortOfOtau } from '../models/ft30/port-of-otau';
import { MeasParamByPosition } from '../models/ft30/ft-measurement-settings';
import { RequestAnswer } from '../models/ft30/request-answer';

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
    portOfOtau.otauId = grpcPortOfOtau.otauId;
    portOfOtau.otauNetAddress = grpcPortOfOtau.otauNetAddress!;
    portOfOtau.otauSerial = grpcPortOfOtau.otauSerial;
    portOfOtau.opticalPort = grpcPortOfOtau.opticalPort;
    portOfOtau.isPortOnMainCharon = grpcPortOfOtau.isPortOnMainCharon;
    portOfOtau.mainCharonPort = grpcPortOfOtau.mainCharonPort;
    return portOfOtau;
  }

  static toGrpcPortOfOtau(portOfOtau: PortOfOtau): grpc.PortOfOtau {
    return {
      otauId: portOfOtau.otauId ?? undefined,
      otauNetAddress:
        portOfOtau.otauNetAddress !== undefined
          ? FtBaseMapping.toGrpcNetAddress(portOfOtau.otauNetAddress)
          : undefined,
      otauSerial: portOfOtau.otauSerial!,
      opticalPort: portOfOtau.opticalPort,
      isPortOnMainCharon: portOfOtau.isPortOnMainCharon,
      mainCharonPort: portOfOtau.mainCharonPort ?? undefined
    };
  }

  static toGrpcMeasParamByPosition(measParam: MeasParamByPosition): grpc.MeasParamByPosition {
    return {
      param: measParam.param,
      position: measParam.position
    };
  }

  static fromGrpcRequestAnswer(grpcRequestAnswer: grpc.RequestAnswer): RequestAnswer {
    const answer = new RequestAnswer();
    answer.returnCode = grpcRequestAnswer.returnCode;
    answer.errorMessage = grpcRequestAnswer.errorMessage;
    return answer;
  }
}
