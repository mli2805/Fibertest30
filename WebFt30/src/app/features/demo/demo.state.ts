import { AppState } from 'src/app/core';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { GreeterState } from './greeter/greeter.state';
import { greeterReducer } from './greeter/greeter.reducer';

export const FEATURE_NAME = 'demo';
export const selectDemoState = createFeatureSelector<DemoState>(FEATURE_NAME);

export const reducers: ActionReducerMap<DemoState> = {
  greeter: greeterReducer
};

export interface DemoState {
  greeter: GreeterState;
}


export interface State extends AppState {
  demo: DemoState;
}
