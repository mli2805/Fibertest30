import { OtauPort } from './otau-port';

export class OtauPortPath {
  monitoringPortId!: number;

  ocmPort!: OtauPort;
  cascadePort: OtauPort | null = null;
}
