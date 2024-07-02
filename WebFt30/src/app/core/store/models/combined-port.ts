import { OtauPort } from './otau-port';
import { MonitoringPort } from './monitoring-port';
import { Otau } from './otau';

export interface CombinedPort {
  otauPort: OtauPort;
  monitoringPort: MonitoringPort | null;
  cascadeOtau: Otau | null;
}
