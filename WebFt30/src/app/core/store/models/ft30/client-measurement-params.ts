import { FtMeasurementSettings } from './ft-measurement-settings';
import { PortOfOtau } from './port-of-otau';

export class ClientMeasurementParams {
  rtuId!: string;
  portOfOtau!: PortOfOtau;
  measSettings!: FtMeasurementSettings;
}
