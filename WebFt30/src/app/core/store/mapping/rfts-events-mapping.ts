import * as grpc from 'src/grpc-generated';
import {
  LevelState,
  MonitoringThreshold,
  RftsEvent,
  RftsEvents,
  RftsEventsSummary,
  RftsLevel,
  TotalFiberLoss
} from '../models/ft30/rfts-events-dto';
import { FtEnumsMapping } from './ft-enums-mapping';

export class RftsEventsMapping {
  static fromRftsEventsDto(grpcRftsEvents: grpc.RftsEventsData): RftsEvents {
    return {
      errorMessage: grpcRftsEvents.errorMessage,
      isNoFiber: grpcRftsEvents.isNoFiber,
      levelArray: grpcRftsEvents.levelArray?.map((level) => this.fromRftsLevelDto(level)) || [],
      summary: grpcRftsEvents.summary
        ? this.fromRftsEventsSummaryDto(grpcRftsEvents.summary)
        : new RftsEventsSummary()
    };
  }

  static fromRftsLevelDto(grpcLevel: grpc.RftsLevel): RftsLevel {
    return {
      level: FtEnumsMapping.fromGrpcFiberState(grpcLevel.level),
      isFailed: grpcLevel.isFailed,
      firstProblemLocation: grpcLevel.firstProblemLocation,
      eventArray: grpcLevel.eventArray?.map((event) => this.fromRftsEventDto(event)) || [],
      totalFiberLoss: grpcLevel.totalFiberLoss
        ? this.fromTotalFiberLossDto(grpcLevel.totalFiberLoss)
        : new TotalFiberLoss()
    };
  }

  static fromGrpcRftsWords(grpcRftsWord: grpc.RftsWords): string {
    // prettier-ignore
    switch(grpcRftsWord) {
        case grpc.RftsWords.Yes: return "i18n.ft.yes";
        case grpc.RftsWords.Fail: return "i18n.ft.fail";
        case grpc.RftsWords.Pass: return "i18n.ft.pass";
        case grpc.RftsWords.NewEvent: return "i18n.ft.new";
        case grpc.RftsWords.FiberBreak: return "i18n.ft.fiber-break";
        case grpc.RftsWords.Empty: return "";
        default:
          throw new Error(`Unknown grpc.RftsWords: ${grpcRftsWord}`);  }
  }

  static fromRftsEventDto(grpcEvent: grpc.RftsEvent): RftsEvent {
    return {
      ordinal: grpcEvent.ordinal,
      isNew: grpcEvent.isNew,
      isFailed: grpcEvent.isFailed,
      landmarkTitle: grpcEvent.landmarkTitle,
      landmarkType: grpcEvent.landmarkType,
      state: this.fromGrpcRftsWords(grpcEvent.state),
      damageType: grpcEvent.damageType,
      distanceKm: grpcEvent.distanceKm,
      enabled: this.fromGrpcRftsWords(grpcEvent.enabled),
      eventType: grpcEvent.eventType,
      reflectanceCoeff: grpcEvent.reflectanceCoeff,
      attenuationInClosure: grpcEvent.attenuationInClosure,
      attenuationCoeff: grpcEvent.attenuationCoeff,
      reflectanceCoeffThreshold: grpcEvent.reflectanceCoeffThreshold
        ? this.fromMonitoringThresholdDto(grpcEvent.reflectanceCoeffThreshold)
        : null,
      attenuationInClosureThreshold: grpcEvent.attenuationInClosureThreshold
        ? this.fromMonitoringThresholdDto(grpcEvent.attenuationInClosureThreshold)
        : null,
      attenuationCoeffThreshold: grpcEvent.attenuationCoeffThreshold
        ? this.fromMonitoringThresholdDto(grpcEvent.attenuationCoeffThreshold)
        : null,
      reflectanceCoeffDeviation: grpcEvent.reflectanceCoeffDeviation,
      attenuationInClosureDeviation: grpcEvent.attenuationInClosureDeviation,
      attenuationCoeffDeviation: grpcEvent.attenuationCoeffDeviation
    };
  }

  static fromTotalFiberLossDto(grpcTotalFiberLoss: grpc.TotalFiberLoss): TotalFiberLoss {
    return {
      value: grpcTotalFiberLoss.value,
      threshold: grpcTotalFiberLoss.threshold
        ? this.fromMonitoringThresholdDto(grpcTotalFiberLoss.threshold)
        : new MonitoringThreshold(),
      deviation: grpcTotalFiberLoss.deviation,
      isPassed: grpcTotalFiberLoss.isPassed
    };
  }

  static fromMonitoringThresholdDto(grpcThreshold: grpc.MonitoringThreshold): MonitoringThreshold {
    return {
      value: grpcThreshold.value,
      isAbsolute: grpcThreshold.isAbsolute
    };
  }

  static fromRftsEventsSummaryDto(grpcSummary: grpc.RftsEventsSummary): RftsEventsSummary {
    return {
      traceState: FtEnumsMapping.fromGrpcFiberState(grpcSummary.traceState),
      breakLocation: grpcSummary.breakLocation,
      orl: grpcSummary.orl,
      levelStates:
        grpcSummary.levelStates?.map((levelState) => this.fromLevelStateDto(levelState)) || []
    };
  }

  static fromLevelStateDto(grpcLevelState: grpc.LevelState): LevelState {
    return {
      levelTitle: grpcLevelState.levelTitle,
      state: grpcLevelState.state
    };
  }
}
