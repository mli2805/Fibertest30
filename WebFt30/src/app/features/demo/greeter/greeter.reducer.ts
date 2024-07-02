import { Action, createReducer, on } from '@ngrx/store';

import { GreeterState } from './greeter.state';
import { GreeterActions } from './greeter.actions';

const initialState: GreeterState = {
  message: null,
  loading: false,
  error: null
};

const reducer = createReducer(
  initialState,

  on(GreeterActions.sayHello, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(GreeterActions.sayHelloSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    message
  })),

  on(GreeterActions.sayHelloFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(GreeterActions.streamHelloNext, (state, { message }) => ({
    ...state,
    message
  })),

  on(GreeterActions.streamHelloComplete, (state) => ({
    ...state,
    loading: false
  })),

  on(GreeterActions.streamHello, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
);

export function greeterReducer(state: GreeterState | undefined, action: Action): GreeterState {
  return reducer(state, action);
}
