import { createReducer, on } from '@ngrx/store';
import { QuickAnalysisState } from './quick-analysis.state';
import { QuickAnalysisActions } from './quick-analysis.actions';

export const initialState: QuickAnalysisState = {
  cachedStats: {
    time: null,
    analysisScope: null,
    timeRange: null,
    stats: null,
    alarms: null
  },
  cumulativeStats: {
    dataPoints: []
  },
  fiberSectionStats: {
    metrics: []
  },
  fiberEventStats: {
    metrics: []
  },
  timeRange: '1h',
  analysisScope: 'Total loss',
  hiddenCharts: [],
  otauPortPath: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(QuickAnalysisActions.setTimeRange, (state, { timeRange }) => ({
    ...state,
    timeRange: timeRange
  })),
  on(QuickAnalysisActions.setAnalysisScope, (state, { analysisScope }) => ({
    ...state,
    analysisScope: analysisScope
  })),
  on(QuickAnalysisActions.setHiddenCharts, (state, { hiddenCharts }) => ({
    ...state,
    hiddenCharts: hiddenCharts
  })),
  on(QuickAnalysisActions.setCachedStats, (state, { cachedStats }) => ({
    ...state,
    cachedStats: cachedStats
  })),
  on(QuickAnalysisActions.setOtauPortPath, (state, { otauPortPath }) => ({
    ...state,
    otauPortPath: otauPortPath
  })),
  on(QuickAnalysisActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(QuickAnalysisActions.getCumulativeStats, (state) => ({
    ...state,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(QuickAnalysisActions.getCumulativeStatsSuccess, (state, cumulativeStats) => ({
    ...state,
    cumulativeStats,
    fiberSectionStats: {
      metrics: []
    },
    fiberEventStats: {
      metrics: []
    },
    loading: false,
    loadedTime: new Date()
  })),
  on(QuickAnalysisActions.getCumulativeStatsFailure, (state, { error }) => ({
    ...state,
    cumulativeStats: {
      dataPoints: []
    },
    fiberSectionStats: {
      metrics: []
    },
    fiberEventStats: {
      metrics: []
    },
    loading: false,
    error
  })),
  on(QuickAnalysisActions.getFiberSectionStats, (state) => ({
    ...state,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(QuickAnalysisActions.getFiberSectionStatsSuccess, (state, fiberSectionStats) => ({
    ...state,
    fiberSectionStats,
    cumulativeStats: {
      dataPoints: []
    },
    fiberEventStats: {
      metrics: []
    },
    loading: false,
    loadedTime: new Date()
  })),
  on(QuickAnalysisActions.getFiberSectionStatsFailure, (state, { error }) => ({
    ...state,
    cumulativeStats: {
      dataPoints: []
    },
    fiberSectionStats: {
      metrics: []
    },
    fiberEventStats: {
      metrics: []
    },
    loading: false,
    error
  })),
  on(QuickAnalysisActions.getFiberEventStats, (state) => ({
    ...state,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(QuickAnalysisActions.getFiberEventStatsSuccess, (state, fiberEventStats) => ({
    ...state,
    cumulativeStats: {
      dataPoints: []
    },
    fiberEventStats,
    fiberSectionStats: {
      metrics: []
    },
    loading: false,
    loadedTime: new Date()
  })),
  on(QuickAnalysisActions.getFiberEventStatsFailure, (state, { error }) => ({
    ...state,
    cumulativeStats: {
      dataPoints: []
    },
    fiberSectionStats: {
      metrics: []
    },
    fiberEventStats: {
      metrics: []
    },
    loading: false,
    error
  }))
);

export function quickAnalysisReducer(
  state: QuickAnalysisState | undefined,
  action: any
): QuickAnalysisState {
  return reducer(state, action);
}
