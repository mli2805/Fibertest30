import { AudioEvent } from 'src/app/core/store/models/ft30/audio-event';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import {
  TraceStateChangedData,
  NetworkEventAddedData,
  BopNetworkEventAddedData,
  RtuStateAccidentAddedData
} from 'src/app/shared/system-events/system-event-data/accidents/accidents-data';

export class AudioEventsMapping {
  // private map(json: string): AnyTypeEvent {
  //   const data = <AnyTypeAccidentAddedData>JSON.parse(json);
  //   const anyTypeEvent = new AnyTypeEvent();
  //   anyTypeEvent.eventType = data.EventType;
  //   anyTypeEvent.eventId = data.EventId;
  //   anyTypeEvent.registeredAt = new Date(data.RegisteredAt);
  //   anyTypeEvent.objTitle = data.ObjTitle;
  //   anyTypeEvent.objId = data.ObjId;
  //   anyTypeEvent.rtuId = data.RtuId;
  //   anyTypeEvent.isOk = data.IsOk;
  //   return anyTypeEvent;
  // }

  static mapFromTraceStateChanged(data: TraceStateChangedData): AudioEvent {
    const anyTypeEvent = new AudioEvent();
    anyTypeEvent.eventType = 'OpticalEvent';
    anyTypeEvent.eventId = data.EventId;
    anyTypeEvent.registeredAt = new Date(data.RegisteredAt);
    anyTypeEvent.objTitle = data.TraceTitle;
    anyTypeEvent.objId = data.TraceId;
    // anyTypeEvent.rtuId = data.RtuId;
    anyTypeEvent.isOk = data.TraceState === FiberState.Ok;
    return anyTypeEvent;
  }

  static mapFromNetworkEventAdded(data: NetworkEventAddedData): AudioEvent {
    const anyTypeEvent = new AudioEvent();
    anyTypeEvent.eventType = 'NetworkEvent';
    anyTypeEvent.eventId = data.EventId;
    anyTypeEvent.registeredAt = new Date(data.RegisteredAt);
    anyTypeEvent.objTitle = data.RtuTitle;
    anyTypeEvent.objId = data.RtuId;
    // anyTypeEvent.rtuId = data.RtuId;
    anyTypeEvent.isOk = data.IsOk;
    return anyTypeEvent;
  }

  static mapFromBopNetworkEventAdded(data: BopNetworkEventAddedData): AudioEvent {
    const anyTypeEvent = new AudioEvent();
    anyTypeEvent.eventType = 'BopNetworkEvent';
    anyTypeEvent.eventId = data.EventId;
    anyTypeEvent.registeredAt = new Date(data.RegisteredAt);
    anyTypeEvent.objTitle = data.BopIp;
    anyTypeEvent.objId = data.BopId;
    // anyTypeEvent.rtuId = data.RtuId;
    anyTypeEvent.isOk = data.IsOk;
    return anyTypeEvent;
  }

  static mapFromRtuStateAccidentAdded(data: RtuStateAccidentAddedData): AudioEvent {
    const anyTypeEvent = new AudioEvent();
    anyTypeEvent.eventType = 'RtuAccident';
    anyTypeEvent.eventId = data.EventId;
    anyTypeEvent.registeredAt = new Date(data.RegisteredAt);
    anyTypeEvent.objTitle = data.ObjTitle;
    anyTypeEvent.objId = data.ObjId;
    // anyTypeEvent.rtuId = data.RtuId;
    anyTypeEvent.isOk = data.IsOk;
    return anyTypeEvent;
  }
}
