import { ActionReducer } from '@ngrx/store';
import { AppState } from '../core.state';

export function onDemandErrorHook(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state, action) {
    const newState = reducer(state, action);

    const error = state?.onDemand?.otdrTask?.error;
    const newError = newState?.onDemand?.otdrTask?.error;

    if (newError && newError !== error) {
      console.warn('OnDemand:', newError);
    }

    return newState;
  };
}
