import * as grpc from 'src/grpc-generated';
import { UserActionLine } from '../models/ft30/user-action-line';
import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';

export class ReportingMapping {
  static fromGrpsUserActionLine(grpcLine: grpc.UserActionLine): UserActionLine {
    const line = new UserActionLine();
    line.ordinal = grpcLine.ordinal;
    line.username = grpcLine.username;
    line.clientIp = grpcLine.clientIp;
    line.registeredAt = Timestamp.toDate(grpcLine.registeredAt!);
    line.logOperationCode = grpcLine.logOperationCode;
    line.rtuTitle = grpcLine.rtuTitle;
    line.traceTitle = grpcLine.traceTitle;
    line.operationParams = grpcLine.operationParams;
    return line;
  }
}
