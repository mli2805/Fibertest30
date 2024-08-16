import { MeasParamByPosition } from './ft-measurement-settings';
import { PortOfOtau } from './port-of-otau';

export class DoMeasurementClientDto {
  rtuId!: string;
  portOfOtau!: PortOfOtau[];
  ms!: MeasParamByPosition[];
}
