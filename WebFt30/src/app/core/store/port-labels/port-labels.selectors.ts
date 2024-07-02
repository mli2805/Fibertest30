import { createSelector } from '@ngrx/store';

import { PortLabelsStateAdapter } from './port-labels.reducer';
import { selectPortLabelsState } from '../../core.state';
import { PortLabelsState } from './port-labels.state';

const { selectAll } = PortLabelsStateAdapter.getSelectors();

const selectPortLabels = createSelector(selectPortLabelsState, (state: PortLabelsState) => state);

const selectPortLabelsLabels = createSelector(selectPortLabels, selectAll);

export const PortLabelsSelectors = {
  selectPortLabels,
  selectPortLabelsLabels
};
