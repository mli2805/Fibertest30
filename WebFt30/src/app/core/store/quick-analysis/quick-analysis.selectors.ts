import { createSelector } from '@ngrx/store';
import { selectQuickAnalysisState } from '../../core.state';
import { QuickAnalysisState } from './quick-analysis.state';

const selectQuickAnalysis = createSelector(
  selectQuickAnalysisState,
  (state: QuickAnalysisState) => state
);

const selectCumulativeStats = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.cumulativeStats
);

const selectFiberSectionStats = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.fiberSectionStats
);

const selectFiberEventStats = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.fiberEventStats
);

const selectTimeRange = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.timeRange
);

const selectAnalysisScope = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.analysisScope
);

const selectHiddenCharts = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.hiddenCharts
);

const selectCachedStats = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.cachedStats
);

const selectOtauPortPath = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.otauPortPath
);

const selectLoading = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.loading
);

const selectLoadedTime = createSelector(
  selectQuickAnalysis,
  (state: QuickAnalysisState) => state.loadedTime
);

const selectErrorMessageId = createSelector(selectQuickAnalysis, (state: QuickAnalysisState) => {
  if (state.error === null) {
    return null;
  }
  return 'i18n.quick-analysis.cant-load-quick-analysis';
});

export const QuickAnalysisSelectors = {
  selectQuickAnalysis,
  selectCumulativeStats,
  selectFiberSectionStats,
  selectFiberEventStats,
  selectTimeRange,
  selectAnalysisScope,
  selectHiddenCharts,
  selectCachedStats,
  selectOtauPortPath,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId
};
