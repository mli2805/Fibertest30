import { OtauPort } from './otau-port';

export class Otau {
  id!: number;
  type!: string;
  ocmPortIndex!: number;
  portCount!: number;
  serialNumber!: string;
  name!: string;
  location!: string;
  rack!: string;
  shelf!: string;
  note!: string;
  jsonParameters!: string;
  isConnected!: boolean;
  onlineAt: Date | null = null;
  offlineAt: Date | null = null;

  ports!: OtauPort[];
}

export interface OxcOtauParameters {
  Ip: string;
  Port: number;
}
