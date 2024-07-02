import { SystemEventLevel } from './system-event-level';
import { SystemEventSource } from './system-event-source';

export class SystemEvent {
  id!: number;
  type!: string;
  level!: SystemEventLevel;
  jsonData!: string;
  source!: SystemEventSource;
  at!: Date;
}
