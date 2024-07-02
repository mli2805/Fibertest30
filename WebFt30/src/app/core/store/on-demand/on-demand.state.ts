import { MeasurementSettings, OtauPortPath } from '../models';
import { OtdrTask } from '../models/task-progress';

export interface OnDemandState {
  measurementSettings: MeasurementSettings | null;
  otauPortPath: OtauPortPath | null;
  otdrTask: OtdrTask | null;
}
