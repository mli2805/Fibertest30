import { Dictionary, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { BaselineSetup } from '../models';
import { BaselineSetupState } from './baseline-setup.state';
import { BaselineSetupActions } from './baseline-setup.actions';
import { OtdrTask } from '../models/task-progress';

export const BaselineSetupStateAdapter = createEntityAdapter<BaselineSetup>({
  selectId: (baselineSetup: BaselineSetup) => baselineSetup.monitoringPortId
});

export const initialState: BaselineSetupState = BaselineSetupStateAdapter.getInitialState({});

const reducer = createReducer(
  initialState,
  on(BaselineSetupActions.startBaseline, (state, { monitoringPortId }) => {
    const entity = state.entities[monitoringPortId];
    if (entity) {
      return BaselineSetupStateAdapter.updateOne(
        {
          id: monitoringPortId,
          changes: {
            otdrTask: OtdrTask.create(true, monitoringPortId)
          }
        },
        state
      );
    }

    // create if not exists
    const newBaselineSetup: BaselineSetup = {
      monitoringPortId,
      otdrTask: OtdrTask.create(true, monitoringPortId)
    };

    return BaselineSetupStateAdapter.addOne(newBaselineSetup, state);
  }),
  on(BaselineSetupActions.startBaselineSuccess, (state, { monitoringPortId }) => {
    const entity = state.entities[monitoringPortId];
    if (entity) {
      return BaselineSetupStateAdapter.updateOne(
        {
          id: monitoringPortId,
          changes: {
            otdrTask: OtdrTask.create(false, monitoringPortId, monitoringPortId.toString())
          }
        },
        state
      );
    }

    // create if not exists
    const newBaselineSetup: BaselineSetup = {
      monitoringPortId,
      otdrTask: OtdrTask.create(false, monitoringPortId, monitoringPortId.toString())
    };

    return BaselineSetupStateAdapter.addOne(newBaselineSetup, state);
  }),

  on(BaselineSetupActions.startBaselineFailure, (state, { monitoringPortId, error }) => {
    return updateOtdrTask(state, +monitoringPortId, {
      starting: false,
      error: error
    });
  }),
  on(BaselineSetupActions.baselineProgress, (state, { progress }) => {
    return updateOtdrTask(state, +progress.otdrTaskId, {
      progress: progress
    });
  }),
  on(BaselineSetupActions.baselineFinished, (state, { progress }) => {
    return updateOtdrTask(state, +progress.otdrTaskId, {
      stopping: false,
      finished: true,
      finishedDate: new Date(),
      error: progress.failReason
    });
  }),
  on(BaselineSetupActions.clearBaselineSetup, (state, { monitoringPortId }) => {
    return BaselineSetupStateAdapter.removeOne(monitoringPortId, state);
  }),
  on(BaselineSetupActions.stopBaseline, (state, { monitoringPortId }) => {
    return updateOtdrTask(state, monitoringPortId, {
      stopping: true
    });
  }),
  on(BaselineSetupActions.stopBaselineSuccess, (state, { monitoringPortId }) => {
    return updateOtdrTask(state, monitoringPortId, {
      stopping: false
    });
  }),
  on(BaselineSetupActions.stopBaselineFailure, (state, { monitoringPortId }) => {
    return updateOtdrTask(state, monitoringPortId, {
      stopping: false
    });
  })
);

function updateOtdrTask(
  state: BaselineSetupState,
  monitoringPortId: number,
  changes: Partial<OtdrTask>
) {
  const entity = state.entities[monitoringPortId];
  if (entity) {
    return BaselineSetupStateAdapter.updateOne(
      {
        id: monitoringPortId,
        changes: {
          otdrTask: {
            ...entity.otdrTask!,
            ...changes
          }
        }
      },
      state
    );
  }

  return state;
}

export function baselineSetupReducer(
  state: BaselineSetupState | undefined,
  action: any
): BaselineSetupState {
  return reducer(state, action);
}
