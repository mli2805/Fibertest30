import * as grpc from 'src/grpc-generated';
import { Trace } from '../models/ft30/trace';
import { FtBaseMapping } from './ft-base-mapping';
import { FtEnumsMapping } from './ft-enums-mapping';
import { Bop } from '../models/ft30/bop';
import { Rtu } from '../models/ft30/rtu';
import { AcceptableParamsMapping } from './acceptable-params-mapping';

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
    trace.tceLinkState = FtEnumsMapping.fromGrpcTceLinkState(grpcTrace.tceLinkState);
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
    rtu.rtuMaker = FtEnumsMapping.fromGrpcRtuMaker(grpcRtu.rtuMaker);
    rtu.title = grpcRtu.title;

    rtu.mfid = grpcRtu.mfid !== undefined ? grpcRtu.mfid : null;
    rtu.mfsn = grpcRtu.mfsn !== undefined ? grpcRtu.mfsn : null;
    rtu.omid = grpcRtu.omid !== undefined ? grpcRtu.omid : null;
    rtu.omsn = grpcRtu.omsn !== undefined ? grpcRtu.omsn : null;
    rtu.serial = grpcRtu.serial !== undefined ? grpcRtu.serial : null;
    rtu.version = grpcRtu.version !== undefined ? grpcRtu.version : null;
    rtu.version2 = grpcRtu.version2 !== undefined ? grpcRtu.version2 : null;

    rtu.ownPortCount = grpcRtu.ownPortCount;
    rtu.fullPortCount = grpcRtu.fullPortCount;

    rtu.mainChannel = FtBaseMapping.fromGrpcNetAddress(grpcRtu.mainChannel!);
    rtu.mainChannelState = FtEnumsMapping.fromGrpcRtuPartState(grpcRtu.mainChannelState);
    rtu.reserveChannel = FtBaseMapping.fromGrpcNetAddress(grpcRtu.reserveChannel!);
    rtu.reserveChannelState = FtEnumsMapping.fromGrpcRtuPartState(grpcRtu.reserveChannelState);
    rtu.isReserveChannelSet = grpcRtu.isReserveChannelSet;
    rtu.otdrNetAddress = FtBaseMapping.fromGrpcNetAddress(grpcRtu.otdrNetAddress!);
    rtu.monitoringMode = FtEnumsMapping.fromGrpcMonitoringState(grpcRtu.monitoringMode);

    rtu.bops = grpcRtu.bops.map((b) => this.fromGrpcBop(b));
    rtu.traces = grpcRtu.traces.map((t) => this.fromGrpcTrace(t));

    rtu.acceptableParams = AcceptableParamsMapping.fromGrpcAcceptableParams(
      grpcRtu.treeOfAcceptableMeasParams!
    );
    return rtu;
  }
}
