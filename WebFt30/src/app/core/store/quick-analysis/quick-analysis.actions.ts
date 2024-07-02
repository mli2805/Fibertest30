import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { AnalysisScope, ICachedStats, ICumulativeStats, IFiberEventOrSectionStats, MetricName, TimeRange } from './quick-analysis.state';
import { OtauPortPath } from '../models';

const setTimeRange = createAction('[QuickAnalysis] Set Time Range', props<{ timeRange: TimeRange }>());

const setAnalysisScope = createAction(
  '[QuickAnalysis] Set Analysis Scope',
  props<{ analysisScope: AnalysisScope }>()
);

const setHiddenCharts = createAction(
  '[QuickAnalysis] Set Hidden Charts',
  props<{ hiddenCharts: string[] }>()
);

const setCachedStats = createAction(
  '[QuickAnalysis] Set Cached Stats',
  props<{ cachedStats: ICachedStats }>()
);

const setOtauPortPath = createAction(
  '[QuickAnalysis] Set Otau Port Path',
  props<{ otauPortPath: OtauPortPath }>()
);

const getCumulativeStats = createAction(
  '[QuickAnalysis] Get Cumulative Stats',
  props<{ timeRange: TimeRange; monitoringPortId: number; metricName: MetricName }>()
);

const getCumulativeStatsSuccess = createAction(
  '[QuickAnalysis] Get Cumulative Stats Success',
  props<ICumulativeStats>()
);

const getCumulativeStatsFailure = createAction(
  '[QuickAnalysis] Get Cumulative Stats Failure',
  props<{ error: ServerError }>()
);

const getFiberSectionStats = createAction(
  '[QuickAnalysis] Get Fiber Section Stats',
  props<{ timeRange: TimeRange; monitoringPortId: number; metricName: MetricName }>()
);

const getFiberSectionStatsSuccess = createAction(
  '[QuickAnalysis] Get Fiber Section Stats Success',
  props<IFiberEventOrSectionStats>()
);

const getFiberSectionStatsFailure = createAction(
  '[QuickAnalysis] Get Fiber Section Stats Failure',
  props<{ error: ServerError }>()
);

const getFiberEventStats = createAction(
  '[QuickAnalysis] Get Fiber Event Stats',
  props<{ timeRange: TimeRange; monitoringPortId: number; metricName: MetricName }>()
);

const getFiberEventStatsSuccess = createAction(
  '[QuickAnalysis] Get Fiber Event Stats Success',
  props<IFiberEventOrSectionStats>()
);

const getFiberEventStatsFailure = createAction(
  '[QuickAnalysis] Get Fiber Event Stats Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[QuickAnalysis] Reset Error');

export const QuickAnalysisActions = {
  setTimeRange,
  setAnalysisScope,
  setHiddenCharts,
  setCachedStats,
  setOtauPortPath,
  getCumulativeStats,
  getCumulativeStatsSuccess,
  getCumulativeStatsFailure,
  getFiberSectionStats,
  getFiberSectionStatsSuccess,
  getFiberSectionStatsFailure,
  getFiberEventStats,
  getFiberEventStatsSuccess,
  getFiberEventStatsFailure,
  resetError
};
