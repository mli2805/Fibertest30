import { MeasurementSettings } from './measurement-settings';

export class MonitoringBaseline {
  public id!: number;
  public monitoringPortId!: number;
  public createdByUserId!: string;
  public createdAt!: Date;
  public measurementSettings!: MeasurementSettings;
}
