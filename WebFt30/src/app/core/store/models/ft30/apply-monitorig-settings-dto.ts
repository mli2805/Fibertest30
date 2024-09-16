import { Frequency, MonitoringState, RtuMaker } from './ft-enums';
import { PortWithTraceDto } from './port-with-trace-dto';

export class ApplyMonitoringSettingsDto {
  rtuId!: string;
  rtuMaker!: RtuMaker;
  isMonitoringOn!: boolean;

  preciseMeas!: Frequency;
  preciseSave!: Frequency;
  fastSave!: Frequency;

  ports!: PortWithTraceDto[];
}
