import * as grpc from 'src/grpc-generated';
import { HasCurrentEvents } from '../models/ft30/has-current-events';
import { BopEvent } from '../models/ft30/bop-event';
import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';
import { OpticalEvent } from '../models/ft30/optical-event';
import { FtEnumsMapping } from './ft-enums-mapping';
import { NetworkEvent } from '../models/ft30/network-event';
import { RtuAccident } from '../models/ft30/rtu-accident';

export class EventTablesMapping {
  static fromGrpcHasCurrentEvents(grpcHas: grpc.HasCurrentEvents): HasCurrentEvents {
    const result = new HasCurrentEvents();
    result.optical = grpcHas.hasCurrentOpticalEvents;
    result.networkRtu = grpcHas.hasCurrentNetworkEvents;
    result.networkBop = grpcHas.hasCurrentBopNetworkEvents;
    result.rtuAccidents = grpcHas.hasCurrentRtuAccidents;
    return result;
  }

  static toOpticalEvents(grpcOpticalEvents: grpc.OpticalEvent[]): OpticalEvent[] {
    const opticalEvents = grpcOpticalEvents.map((item) => this.toOpticalEvent(item));
    return opticalEvents;
  }

  static toOpticalEvent(grpcOpticalEvent: grpc.OpticalEvent): OpticalEvent {
    const opticalEvent = new OpticalEvent();
    opticalEvent.eventId = grpcOpticalEvent.eventId;
    opticalEvent.measuredAt = Timestamp.toDate(grpcOpticalEvent.measuredAt!);
    opticalEvent.registeredAt = Timestamp.toDate(grpcOpticalEvent.registeredAt!);

    opticalEvent.rtuTitle = grpcOpticalEvent.rtuTitle;
    opticalEvent.rtuId = grpcOpticalEvent.rtuId;
    opticalEvent.traceTitle = grpcOpticalEvent.traceTitle;
    opticalEvent.traceId = grpcOpticalEvent.traceId;

    opticalEvent.baseRefType = grpcOpticalEvent.baseRefType;
    opticalEvent.traceState = FtEnumsMapping.fromGrpcFiberState(grpcOpticalEvent.traceState);

    opticalEvent.eventStatus = grpcOpticalEvent.eventStatus;
    opticalEvent.statusChangedAt = Timestamp.toDate(grpcOpticalEvent.statusChangedAt!);
    opticalEvent.statusChangedByUser = grpcOpticalEvent.statusChangedByUser;

    opticalEvent.comment = grpcOpticalEvent.comment;

    return opticalEvent;
  }

  static toNetworkEvents(grpcNetworkEvents: grpc.NetworkEvent[]): NetworkEvent[] {
    const networkEvents = grpcNetworkEvents.map((item) => this.toNetworkEvent(item));
    return networkEvents;
  }

  static toNetworkEvent(grpcNetworkEvent: grpc.NetworkEvent): NetworkEvent {
    const networkEvent = new NetworkEvent();
    networkEvent.eventId = grpcNetworkEvent.eventId;
    networkEvent.registeredAt = Timestamp.toDate(grpcNetworkEvent.registeredAt!);
    networkEvent.rtuTitle = grpcNetworkEvent.rtuTitle;
    networkEvent.rtuId = grpcNetworkEvent.rtuId;
    networkEvent.isRtuAvailable = grpcNetworkEvent.isRtuAvailable;
    networkEvent.onMainChannel = FtEnumsMapping.fromGrpcChannelEvent(
      grpcNetworkEvent.onMainChannel
    );
    networkEvent.onReserveChannel = FtEnumsMapping.fromGrpcChannelEvent(
      grpcNetworkEvent.onReserveChannel
    );
    return networkEvent;
  }

  static toBopEvents(grpcBopEvents: grpc.BopEvent[]): BopEvent[] {
    return grpcBopEvents.map((i) => this.toBopEvent(i));
  }

  static toBopEvent(grpcBopEvent: grpc.BopEvent): BopEvent {
    const bopEvent = new BopEvent();
    bopEvent.eventId = grpcBopEvent.eventId;
    bopEvent.registeredAt = Timestamp.toDate(grpcBopEvent.registeredAt!);
    bopEvent.bopAddress = grpcBopEvent.bopAddress;
    bopEvent.rtuTitle = grpcBopEvent.rtuTitle;
    bopEvent.rtuId = grpcBopEvent.rtuId;
    bopEvent.serial = grpcBopEvent.serial;
    bopEvent.isBopOk = grpcBopEvent.isBopOk;
    return bopEvent;
  }

  static toRtuAccidents(grpcRtuAccidents: grpc.RtuAccident[]): RtuAccident[] {
    return grpcRtuAccidents.map((a) => this.toRtuAccident(a));
  }

  static toRtuAccident(grpcRtuAccident: grpc.RtuAccident): RtuAccident {
    const rtuAccident = new RtuAccident();
    rtuAccident.id = grpcRtuAccident.id;
    rtuAccident.isMeasurementProblem = grpcRtuAccident.isMeasurementProblem;
    rtuAccident.returnCode = FtEnumsMapping.fromGrpcReturnCode(grpcRtuAccident.returnCode);
    rtuAccident.registeredAt = Timestamp.toDate(grpcRtuAccident.registeredAt!);
    rtuAccident.rtuTitle = grpcRtuAccident.rtuTitle;
    rtuAccident.rtuId = grpcRtuAccident.rtuId;
    rtuAccident.traceTitle = grpcRtuAccident.traceTitle;
    rtuAccident.traceId = grpcRtuAccident.traceId;
    rtuAccident.baseRefType = grpcRtuAccident.baseRefType;
    rtuAccident.comment = grpcRtuAccident.comment;

    return rtuAccident;
  }
}
