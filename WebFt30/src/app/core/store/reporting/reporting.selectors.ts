import { createSelector } from '@ngrx/store';
import { selectReportingState } from '../../core.state';
import { ReportingState } from './reporting.state';

const selectLoading = createSelector(
  selectReportingState,
  (state: ReportingState) => state.loading
);
const selectErrorMessageId = createSelector(
  selectReportingState,
  (state: ReportingState) => state.errorMessageId
);
const selectUserActionLines = createSelector(
  selectReportingState,
  (state: ReportingState) => state.userActionLines
);

export const ReportingSelectors = {
  selectLoading,
  selectErrorMessageId,
  selectUserActionLines
};
