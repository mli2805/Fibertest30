import * as grpc from 'src/grpc-generated';
import { FiberState, MonitoringState, RtuPartState } from '../models/ft30/ft-enums';

export class FtEnumsMapping {
  static fromGrpcFiberState(grpcFiberState: grpc.FiberState): FiberState {
    // prettier-ignore
    switch (grpcFiberState) {
      case grpc.FiberState.NotInTrace: return FiberState.NotInTrace;
      case grpc.FiberState.NotJoined: return FiberState.NotJoined;
      case grpc.FiberState.FiberState_Unknown: return FiberState.Unknown;
      case grpc.FiberState.NotInZone: return FiberState.NotInZone;
      case grpc.FiberState.FiberState_Ok: return FiberState.Ok;
      case grpc.FiberState.Suspicion: return FiberState.Suspicion;
      case grpc.FiberState.Minor: return FiberState.Minor;
      case grpc.FiberState.Major: return FiberState.Major;
      case grpc.FiberState.Critical: return FiberState.Critical;
      case grpc.FiberState.User: return FiberState.User;
      case grpc.FiberState.FiberBreak: return FiberState.FiberBreak;
      case grpc.FiberState.NoFiber: return FiberState.NoFiber;
      case grpc.FiberState.HighLighted: return FiberState.HighLighted;
      case grpc.FiberState.DistanceMeasurement: return FiberState.DistanceMeasurement;
      case grpc.FiberState.Nothing: return FiberState.Nothing;
      default:
        throw new Error(`Unknown grpc.FiberState: ${grpcFiberState}`);
    }
  }

  static fromGrpcMonitoringState(grpcMonitoringState: grpc.MonitoringState): MonitoringState {
    // prettier-ignore
    switch (grpcMonitoringState) {
        case grpc.MonitoringState.MonitoringState_Unknown: return MonitoringState.Unknown;
        case grpc.MonitoringState.Off: return MonitoringState.Off;
        case grpc.MonitoringState.On: return MonitoringState.On;
        default:
            throw new Error(`Unknown grpc.MonitoringState: ${grpcMonitoringState}`);
    }
  }

  static fromGrpcRtuPartState(grpcRtuPartState: grpc.RtuPartState): RtuPartState {
    // prettier-ignore
    switch (grpcRtuPartState) {
        case grpc.RtuPartState.Broken: return RtuPartState.Broken;
        case grpc.RtuPartState.NotSetYet: return RtuPartState.NotSetYet;
        case grpc.RtuPartState.RtuPartState_Ok: return RtuPartState.Ok;
        default:
            throw new Error(`Unknown grpc.RtuPartState: ${grpcRtuPartState}`);
    }
  }
}
