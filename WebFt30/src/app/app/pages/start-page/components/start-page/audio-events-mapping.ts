import { AudioEvent } from 'src/app/core/store/models/ft30/audio-event';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import {
  TraceStateChangedData,
  NetworkEventAddedData,
  BopNetworkEventAddedData,
  RtuStateAccidentAddedData
} from 'src/app/shared/system-events/system-event-data/accidents/accidents-data';

export class AudioEventsMapping {
  static mapFromTraceStateChanged(data: TraceStateChangedData): AudioEvent {
    const audioEvent = new AudioEvent();
    audioEvent.eventType = 'OpticalEvent';
    audioEvent.eventId = data.EventId;
    audioEvent.registeredAt = new Date(data.RegisteredAt);
    audioEvent.objTitle = data.TraceTitle;
    audioEvent.objId = data.TraceId;
    audioEvent.baseRefType = data.BaseRefType;
    audioEvent.isOk = data.TraceState === FiberState.Ok;
    return audioEvent;
  }

  static mapFromNetworkEventAdded(data: NetworkEventAddedData): AudioEvent {
    const audioEvent = new AudioEvent();
    audioEvent.eventType = 'NetworkEvent';
    audioEvent.eventId = data.EventId;
    audioEvent.registeredAt = new Date(data.RegisteredAt);
    audioEvent.objTitle = data.RtuTitle;
    audioEvent.objId = data.RtuId;
    audioEvent.isOk = data.IsOk;
    return audioEvent;
  }

  static mapFromBopNetworkEventAdded(data: BopNetworkEventAddedData): AudioEvent {
    const audioEvent = new AudioEvent();
    audioEvent.eventType = 'BopNetworkEvent';
    audioEvent.eventId = data.EventId;
    audioEvent.registeredAt = new Date(data.RegisteredAt);
    audioEvent.objTitle = data.BopIp;
    audioEvent.objId = data.BopId;
    audioEvent.isOk = data.IsOk;
    return audioEvent;
  }

  static mapFromRtuStateAccidentAdded(data: RtuStateAccidentAddedData): AudioEvent {
    const audioEvent = new AudioEvent();
    audioEvent.eventType = 'RtuAccident';
    audioEvent.eventId = data.EventId;
    audioEvent.registeredAt = new Date(data.RegisteredAt);
    audioEvent.objTitle = data.ObjTitle;
    audioEvent.objId = data.ObjId;
    audioEvent.isOk = data.IsOk;
    return audioEvent;
  }
}
