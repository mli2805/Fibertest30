import * as grpc from 'src/grpc-generated';
import { RtuInitializedDto } from '../models/ft30/rtu-initialized-dto';
import { DoMeasurementClientDto } from '../models/ft30/do-measurement-client-dto';
import { FtBaseMapping } from './ft-base-mapping';
import { ApplyMonitoringSettingsDto } from '../models/ft30/apply-monitorig-settings-dto';
import { PortWithTraceDto } from '../models/ft30/port-with-trace-dto';
import { FtEnumsMapping } from './ft-enums-mapping';
import { AssignBaseRefsDto, BaseRefFile } from '../models/ft30/assign-base-refs-dto';
import { BaseRefsAssignedDto } from '../models/ft30/base-refs-assigned-dto';

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

  static toGrpcBaseRefFile(dto: BaseRefFile): grpc.BaseRefFile {
    return {
      baseRefType: dto.baseRefType,
      fileBytes: dto.fileContent !== null ? dto.fileContent : undefined,
      isForDelete: dto.isForDelete
    };
  }

  static toGrpcAssingBaseRefsDto(dto: AssignBaseRefsDto): grpc.AssignBaseRefsDto {
    return {
      rtuId: dto.rtuId,
      rtuMaker: dto.rtuMaker,
      traceId: dto.traceId,
      portOfOtau: dto.portOfOtau ? FtBaseMapping.toGrpcPortOfOtau(dto.portOfOtau!) : undefined,
      baseRefFiles: dto.baseFiles.map((f) => this.toGrpcBaseRefFile(f)),
      deleteSors: dto.deleteSors
    };
  }

  static fromGrpcBaseRefsAssignedDto(grpcDto: grpc.BaseRefsAssignedDto): BaseRefsAssignedDto {
    const result = new BaseRefsAssignedDto();
    result.returnCode = grpcDto.returnCode;
    result.baseRefType = grpcDto.baseRefType;
    result.nodes = grpcDto.nodes;
    result.equipments = grpcDto.equipments;
    result.landmarks = grpcDto.landmarks;
    if (grpcDto.waveLength) result.waveLength = grpcDto.waveLength;
    else result.waveLength = null;
    return result;
  }
}
