import { MeasurementSettings } from './measurement-settings';

export class CompletedOnDemand {
  id!: string;
  createdByUserId!: string;
  completedAt!: Date;
  monitoringPortId!: number;
  measurementSettings!: MeasurementSettings;
}
