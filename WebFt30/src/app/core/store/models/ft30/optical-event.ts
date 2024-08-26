import { BaseRefType, EventStatus, FiberState } from './ft-enums';

export class OpticalEvent {
  eventId!: number;
  measuredAt!: Date;
  registeredAt!: Date;

  rtuTitle!: string;
  rtuId!: string;
  traceTitle!: string;
  traceId!: string;

  baseRefType!: BaseRefType;
  traceState!: FiberState;

  eventStatus!: EventStatus;
  statusChangedAt!: Date;
  statusChangedByUser!: string;

  comment!: string;
}
