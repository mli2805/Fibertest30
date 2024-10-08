import * as grpc from 'src/grpc-generated';
import { Trace } from '../models/ft30/trace';
import { FtBaseMapping } from './ft-base-mapping';
import { FtEnumsMapping } from './ft-enums-mapping';
import { Bop } from '../models/ft30/bop';
import { Rtu } from '../models/ft30/rtu';
import { AcceptableParamsMapping } from './acceptable-params-mapping';
import { MonitoringState, RtuPartState } from '../models/ft30/ft-enums';
import { PortOfOtau } from '../models/ft30/port-of-otau';

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
    trace.fastDuration = grpcTrace.fastDuration;
    trace.preciseDuration = grpcTrace.preciseDuration;
    trace.additionalDuration = grpcTrace.additionalDuration;
    trace.preciseSorId = grpcTrace.preciseSorId;
    trace.fastSorId = grpcTrace.fastSorId;
    trace.additionalSorId = grpcTrace.additionalSorId;
    return trace;
  }

  static fromGrpcBop(grpcBop: grpc.Bop): Bop {
    const bop = new Bop();
    bop.bopId = grpcBop.bopId;
    bop.rtuId = grpcBop.rtuId;
    bop.bopNetAddress = FtBaseMapping.fromGrpcNetAddress(grpcBop.bopNetAddress!);
    bop.masterPort = grpcBop.masterPort;
    bop.isOk = grpcBop.isOk;
    bop.bopState = grpcBop.isOk ? RtuPartState.Ok : RtuPartState.Broken;
    bop.serial = grpcBop.serial;
    bop.portCount = grpcBop.portCount;
    bop.traces = grpcBop.traces.map((t) => this.fromGrpcTrace(t));

    // calculated properties
    bop.children = this.arrangeBopChildren(bop);
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
    rtu.preciseMeas = grpcRtu.preciseMeas;
    rtu.preciseSave = grpcRtu.preciseSave;
    rtu.fastSave = grpcRtu.fastSave;

    rtu.bops = grpcRtu.bops.map((b) => this.fromGrpcBop(b));
    rtu.traces = grpcRtu.traces.map((t) => this.fromGrpcTrace(t));

    rtu.acceptableParams = AcceptableParamsMapping.fromGrpcAcceptableParams(
      grpcRtu.treeOfAcceptableMeasParams!
    );

    // calculated properties
    rtu.isRtuAvailable =
      rtu.mainChannelState === RtuPartState.Ok || rtu.reserveChannelState === RtuPartState.Ok;
    rtu.isMonitoringOn = rtu.monitoringMode === MonitoringState.On;
    rtu.bopsState = this.evaluateBopsState(rtu);
    rtu.children = this.arrangeRtuChildren(rtu);
    return rtu;
  }

  private static arrangeBopChildren(bop: Bop): any[] {
    const oneBopChildren: any[] = [];
    for (let i = 0; i < bop.portCount; i++) {
      const trace = bop.traces.find((t) => t.port !== null && t.port.opticalPort === i + 1);
      if (trace !== undefined) {
        const child = { type: 'attached-trace', port: i + 1, payload: trace };
        oneBopChildren.push(child);
        continue;
      }
      const freePort = new PortOfOtau();
      freePort.otauId = bop.bopId;
      freePort.otauSerial = bop.serial;
      freePort.otauNetAddress = bop.bopNetAddress;
      freePort.rtuId = bop.rtuId;
      freePort.isPortOnMainCharon = false;
      freePort.opticalPort = i + 1;
      freePort.mainCharonPort = bop.masterPort;
      const child = { type: 'free-port', port: i + 1, payload: freePort };
      oneBopChildren.push(child);
    }
    return oneBopChildren;
  }

  private static arrangeRtuChildren(rtu: Rtu): any[] {
    const children = [];
    for (let i = 0; i < rtu.ownPortCount; i++) {
      const bop = rtu.bops.find((b) => b.masterPort === i + 1);
      if (bop !== undefined) {
        const child = { type: 'bop', port: i + 1, payload: bop };
        children.push(child);
        continue;
      }
      const trace = rtu.traces.find((t) => t.port !== null && t.port.opticalPort === i + 1);
      if (trace !== undefined) {
        const child = { type: 'attached-trace', port: i + 1, payload: trace };
        children.push(child);
        continue;
      }
      const freePort = new PortOfOtau();
      freePort.rtuId = rtu.rtuId;
      freePort.otauSerial = rtu.serial!; // порты есть только у инициализированного рту
      freePort.isPortOnMainCharon = true;
      freePort.opticalPort = i + 1;
      const child = { type: 'free-port', port: i + 1, payload: freePort };
      children.push(child);
    }

    for (const trace of rtu.traces) {
      if (trace.port === null) {
        const child = { type: 'detached-trace', port: -1, payload: trace };
        children.push(child);
      }
    }

    return children;
  }

  private static evaluateBopsState(rtu: Rtu): RtuPartState {
    let bopState = RtuPartState.NotSetYet;
    for (const bop of rtu.bops) {
      if (bop.isOk) bopState = RtuPartState.Ok;
      else {
        bopState = RtuPartState.Broken;
        return bopState;
      }
    }
    return bopState;
  }
}
