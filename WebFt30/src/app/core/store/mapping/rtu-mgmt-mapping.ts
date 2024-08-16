import * as grpc from 'src/grpc-generated';
import { RtuInitializedDto } from '../models/ft30/rtu-initialized-dto';
import { DoMeasurementClientDto } from '../models/ft30/do-measurement-client-dto';
import { FtBaseMapping } from './ft-base-mapping';

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
}
