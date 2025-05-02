import { BaseRefType } from './ft-enums';

export class AudioEvent {
  eventType!: string;
  registeredAt!: Date;
  eventId!: number;
  objTitle!: string;
  objId!: string;
  baseRefType!: BaseRefType | undefined; // только для optical events
  isOk!: boolean;
}
