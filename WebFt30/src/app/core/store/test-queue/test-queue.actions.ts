import { createAction, props } from '@ngrx/store';
import { OtdrTaskProgress } from '../models/task-progress';

const setCurrent = createAction(
  '[Test Queue] Set Current',
  props<{ current: OtdrTaskProgress | null }>()
);

const setLast = createAction('[Test Queue] Set Last', props<{ last: OtdrTaskProgress }>());

export const TestQueueActions = {
  setCurrent,
  setLast
};
