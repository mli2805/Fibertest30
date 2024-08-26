import * as grpc from 'src/grpc-generated';
import {
  BaseRefType,
  EventStatus,
  FiberState,
  MonitoringState,
  RtuMaker,
  RtuPartState,
  TceLinkState
} from '../models/ft30/ft-enums';

export class FtEnumsMapping {
  static fromGrpcRtuMaker(grpcRtuMaker: grpc.RtuMaker): RtuMaker {
    switch (grpcRtuMaker) {
      case grpc.RtuMaker.Iit:
        return RtuMaker.Iit;
      case grpc.RtuMaker.Veex:
        return RtuMaker.Veex;
      default:
        throw new Error(`Unknown grpc.RtuMaker: ${grpcRtuMaker}`);
    }
  }

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

  static fromGrpcTceLinkState(grpcTceLinkState: grpc.TceLinkState): TceLinkState {
    // prettier-ignore
    switch(grpcTceLinkState) {
      case grpc.TceLinkState.NoLink: return TceLinkState.NoLink;
      case grpc.TceLinkState.SnmpTrapOff: return TceLinkState.SnmpTrapOff;
      case grpc.TceLinkState.SnmpTrapOn: return TceLinkState.SnmpTrapOn;
      default:
        throw new Error(`Unknown grpc.TceLinkState: ${grpcTceLinkState}`);
    }
  }

  static fromGrpcBaseRefType(grpcType: grpc.BaseRefType): BaseRefType {
    // prettier-ignore
    switch(grpcType) {
      case grpc.BaseRefType.None: return BaseRefType.None;
      case grpc.BaseRefType.Precise: return BaseRefType.Precise;
      case grpc.BaseRefType.Fast: return BaseRefType.Fast;
      case grpc.BaseRefType.Additional: return BaseRefType.Additional;
      default:
        throw new Error(`Unknown grpc.BaseRefType: ${grpcType}`); 
    }
  }

  static fromGrpcEventStatus(grpcStatus: grpc.EventStatus): EventStatus {
    // prettier-ignore
    switch(grpcStatus) {
      case grpc.EventStatus.JustMeasurementNotAnEvent: return EventStatus.JustMeasurementNotAnEvent;
      case grpc.EventStatus.EventButNotAnAccident: return EventStatus.EventButNotAnAccident;
      case grpc.EventStatus.Unprocessed: return EventStatus.Unprocessed;
      case grpc.EventStatus.NotImportant: return EventStatus.NotImportant;
      case grpc.EventStatus.Planned: return EventStatus.Planned;
      case grpc.EventStatus.NotConfirmed: return EventStatus.NotConfirmed;
      case grpc.EventStatus.Suspended: return EventStatus.Suspended;
      case grpc.EventStatus.Confirmed: return EventStatus.Confirmed;
      default:
        throw new Error(`Unknown grpc.EventStatus: ${grpcStatus}`);
    }
  }
}
