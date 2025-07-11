import * as grpc from 'src/grpc-generated';
import {
  ChannelEvent,
  EventStatus,
  FiberState,
  MonitoringCurrentStep,
  MonitoringState,
  OpticalAccidentType,
  RtuMaker,
  RtuPartState,
  TceLinkState
} from '../models/ft30/ft-enums';
import { ReturnCode } from '../models/ft30/return-code';

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

  static fromGrpcChannelEvent(grpcChannelEvent: grpc.ChannelEvent): ChannelEvent {
    // prettier-ignore
    switch(grpcChannelEvent) {
      case grpc.ChannelEvent.ChannelEvent_Broken: return ChannelEvent.Broken;
      case grpc.ChannelEvent.ChannelEvent_Nothing: return ChannelEvent.Nothing;
      case grpc.ChannelEvent.Repaired: return ChannelEvent.Repaired;
      default:
        throw new Error(`Unknown grpc.ChannelEvent: ${grpcChannelEvent}`);  }
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

  static toGrpcFiberState(state: FiberState): grpc.FiberState {
    const enumCode = this.getFiberStateNumericKey(state);
    return enumCode;
  }

  static getFiberStateNumericKey(enumValue: FiberState): number {
    return +Object.keys(FiberState)
      .filter((k) => !isNaN(Number(k)))
      .find((g) => FiberState[+g] === FiberState[enumValue])!;
  }

  static getReturnCodeNumericKey(enumValue: ReturnCode): number {
    return +Object.keys(ReturnCode)
      .filter((k) => !isNaN(Number(k)))
      .find((g) => ReturnCode[+g] === ReturnCode[enumValue])!;
  }

  static getGrpcReturnCodeNumericKey(enumValue: grpc.ReturnCode): number {
    return +Object.keys(grpc.ReturnCode)
      .filter((k) => !isNaN(Number(k)))
      .find((g) => grpc.ReturnCode[+g] === grpc.ReturnCode[enumValue])!;
  }

  static fromGrpcReturnCode(grpcReturnCode: grpc.ReturnCode): ReturnCode {
    const enumCode = this.getReturnCodeNumericKey(grpcReturnCode);
    return enumCode;
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

  // можно присваивать напрямую
  // static fromGrpcBaseRefType(grpcType: grpc.BaseRefType): BaseRefType {
  //   // prettier-ignore
  //   switch(grpcType) {
  //     case grpc.BaseRefType.None: return BaseRefType.None;
  //     case grpc.BaseRefType.Precise: return BaseRefType.Precise;
  //     case grpc.BaseRefType.Fast: return BaseRefType.Fast;
  //     case grpc.BaseRefType.Additional: return BaseRefType.Additional;
  //     default:
  //       throw new Error(`Unknown grpc.BaseRefType: ${grpcType}`);
  //   }
  // }

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

  static fromGrpcCurrentStep(grpcStep: grpc.MonitoringCurrentStep): MonitoringCurrentStep {
    // prettier-ignore
    switch(grpcStep) {
      case grpc.MonitoringCurrentStep.Unknown: return MonitoringCurrentStep.Unknown;
      case grpc.MonitoringCurrentStep.Idle: return MonitoringCurrentStep.Idle;
      case grpc.MonitoringCurrentStep.Toggle: return MonitoringCurrentStep.Toggle;
      case grpc.MonitoringCurrentStep.Measure: return MonitoringCurrentStep.Measure;
      case grpc.MonitoringCurrentStep.FailedOtauProblem: return MonitoringCurrentStep.FailedOtauProblem;
      case grpc.MonitoringCurrentStep.FailedOtdrProblem: return MonitoringCurrentStep.FailedOtdrProblem;
      case grpc.MonitoringCurrentStep.Interrupted: return MonitoringCurrentStep.Interrupted;
      case grpc.MonitoringCurrentStep.Analysis: return MonitoringCurrentStep.Analysis;
      case grpc.MonitoringCurrentStep.MeasurementFinished: return MonitoringCurrentStep.MeasurementFinished;
      default:
        throw new Error(`Unknown grpc.MonitoringCurrentStep: ${grpcStep}`);
    }
  }

  static fromGrpcOpticalAccidentType(grpcType: grpc.OpticalAccidentType): OpticalAccidentType {
    // prettier-ignore
    switch(grpcType) {
      case grpc.OpticalAccidentType.Break: return OpticalAccidentType.Break;
      case grpc.OpticalAccidentType.Loss: return OpticalAccidentType.Loss;
      case grpc.OpticalAccidentType.Reflectance: return OpticalAccidentType.Reflectace;
      case grpc.OpticalAccidentType.LossCoeff: return OpticalAccidentType.LossCoef;
      case grpc.OpticalAccidentType.TotalLoss: return OpticalAccidentType.TotalLoss;
      case grpc.OpticalAccidentType.OpticalAccidentType_None: return OpticalAccidentType.None;
    }
  }
}
