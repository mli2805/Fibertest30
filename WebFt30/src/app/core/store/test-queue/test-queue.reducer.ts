import { createReducer, on } from '@ngrx/store';
import { TestQueueState } from './test-queue.state';
import { TestQueueActions } from './test-queue.actions';

export const initialState: TestQueueState = {
  last: null,
  current: null
};

const reducer = createReducer(
  initialState,
  on(TestQueueActions.setCurrent, (state, { current }) => ({ ...state, current })),
  on(TestQueueActions.setLast, (state, { last }) => ({ ...state, last }))
);

export function testQueueReducer(state: TestQueueState | undefined, action: any): TestQueueState {
  return reducer(state, action);
}
