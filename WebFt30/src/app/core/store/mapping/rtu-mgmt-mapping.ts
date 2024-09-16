import * as grpc from 'src/grpc-generated';
import { RtuInitializedDto } from '../models/ft30/rtu-initialized-dto';
import { DoMeasurementClientDto } from '../models/ft30/do-measurement-client-dto';
import { FtBaseMapping } from './ft-base-mapping';
import { ApplyMonitoringSettingsDto } from '../models/ft30/apply-monitorig-settings-dto';
import { PortWithTraceDto } from '../models/ft30/port-with-trace-dto';
import { FtEnumsMapping } from './ft-enums-mapping';

export class RtuMgmtMapping {
  static fromGrpcRtuInitializedDto(grpcDto: grpc.RtuInitializedDto): RtuInitializedDto {
    const dto = new RtuInitializedDto();
    dto.isInitialized = grpcDto.isInitialized;
    return dto;
  }

  static toGrpcDoClientMeasurementDto(dto: DoMeasurementClientDto): grpc.DoMeasurementClientDto {
    return {
      rtuId: dto.rtuId,
      portOfOtau: dto.portOfOtau.map((p) => FtBaseMapping.toGrpcPortOfOtau(p)),
      measParamsByPosition: dto.ms.map((m) => FtBaseMapping.toGrpcMeasParamByPosition(m))
    };
  }

  static toGrpcPortWithTraceDto(dto: PortWithTraceDto): grpc.PortWithTraceDto {
    return {
      traceId: dto.traceId,
      portOfOtau: FtBaseMapping.toGrpcPortOfOtau(dto.portOfOtau),
      lastTraceState: FtEnumsMapping.toGrpcFiberState(dto.lastTraceState),
      lastRtuAccidentOnTrace: dto.lastRtuAccidentOnTrace
    };
  }

  static toGrpcApplyMonitoringSettingsDto(
    dto: ApplyMonitoringSettingsDto
  ): grpc.ApplyMonitoringSettingsDto {
    return {
      rtuId: dto.rtuId,
      rtuMaker: dto.rtuMaker,
      isMonitoringOn: dto.isMonitoringOn,
      preciseMeas: dto.preciseMeas,
      preciseSave: dto.preciseSave,
      fastSave: dto.fastSave,
      ports: dto.ports.map((l) => this.toGrpcPortWithTraceDto(l))
    };
  }
}
