import { ChannelEvent } from './ft-enums';

export class NetworkEvent {
  eventId!: number;
  registeredAt!: Date;
  rtuTitle!: string;
  rtuId!: string;
  isRtuAvailable!: boolean;
  onMainChannel!: ChannelEvent;
  onReserveChannel!: ChannelEvent;
}
