import * as grpc from 'src/grpc-generated';
import { RtuInitializedDto } from '../models/ft30/rtu-initialized-dto';

export class RtuMgmtMapping {
  static fromGrpcRtuInitializedDto(grpcDto: grpc.RtuInitializedDto): RtuInitializedDto {
    const dto = new RtuInitializedDto();
    dto.isInitialized = grpcDto.isInitialized;
    return dto;
  }
}
