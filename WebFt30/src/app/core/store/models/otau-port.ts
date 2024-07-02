import { MonitoringPort } from './monitoring-port';

export class OtauPort {
  id!: number;
  portIndex!: number;
  unavailable!: boolean;

  otauId!: number;
  monitoringPortId!: number;
}
