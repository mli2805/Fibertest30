import * as grpc from 'src/grpc-generated';
import { Trace } from '../models/ft30/trace';
import { FtBaseMapping } from './ft-base-mapping';
import { FtEnumsMapping } from './ft-enums-mapping';
import { Bop } from '../models/ft30/bop';
import { Rtu } from '../models/ft30/rtu';

export class TreeMapping {
  static fromGrpcTrace(grpcTrace: grpc.Trace): Trace {
    const trace = new Trace();
    trace.traceId = grpcTrace.traceId;
    trace.rtuId = grpcTrace.rtuId;
    trace.title = grpcTrace.title;
    trace.port =
      grpcTrace.port !== undefined ? FtBaseMapping.fromGrpcPortOfOtau(grpcTrace.port!) : null;
    trace.isAttached = grpcTrace.isAttached;
    trace.state = FtEnumsMapping.fromGrpcFiberState(grpcTrace.state);
    trace.hasEnoughBaseRefsToPerformMonitoring = grpcTrace.hasEnoughBaseRefsToPerformMonitoring;
    trace.isIncludedInMonitoringCycle = grpcTrace.isIncludedInMonitoringCycle;
    return trace;
  }

  static fromGrpcBop(grpcBop: grpc.Bop): Bop {
    const bop = new Bop();
    bop.bopId = grpcBop.bopId;
    bop.rtuId = grpcBop.rtuId;
    bop.bopNetAddress = FtBaseMapping.fromGrpcNetAddress(grpcBop.bopNetAddress!);
    bop.masterPort = grpcBop.masterPort;
    bop.isOk = grpcBop.isOk;
    bop.serial = grpcBop.serial;
    bop.portCount = grpcBop.portCount;
    bop.traces = grpcBop.traces.map((t) => this.fromGrpcTrace(t));
    return bop;
  }

  static fromGrpcRtu(grpcRtu: grpc.Rtu): Rtu {
    const rtu = new Rtu();
    rtu.rtuId = grpcRtu.rtuId;
    rtu.title = grpcRtu.title;
    rtu.mainChannelState = FtEnumsMapping.fromGrpcRtuPartState(grpcRtu.mainChannelState);
    rtu.reserveChannelState = FtEnumsMapping.fromGrpcRtuPartState(grpcRtu.reserveChannelState);
    rtu.monitoringMode = FtEnumsMapping.fromGrpcMonitoringState(grpcRtu.monitoringMode);
    rtu.ownPortCount = grpcRtu.ownPortCount;
    rtu.bops = grpcRtu.bops.map((b) => this.fromGrpcBop(b));
    rtu.traces = grpcRtu.traces.map((t) => this.fromGrpcTrace(t));
    return rtu;
  }
}
