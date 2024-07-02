import { OtdrTaskProgress } from '../models/task-progress';

export interface TestQueueState {
  last: OtdrTaskProgress | null;
  current: OtdrTaskProgress | null;
}
