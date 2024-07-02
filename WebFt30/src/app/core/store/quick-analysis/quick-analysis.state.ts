import { ServerError } from '../../models/server-error';
import { DataPoint, OtauPortPath } from '../models';
import { MonitoringAlarmEvent } from '../models/monitoring-alarm-event';

export const TimeRanges = ['1h', '2h', '4h', '12h', '1d', '7d', '30d'] as const;
export type TimeRange = (typeof TimeRanges)[number];

export const AnalysisScopes = [
  'Latency',
  'Total loss',
  'Total ORL',
  'Event loss',
  'Event reflectance',
  'Section loss',
  'Section attenuation'
] as const;
export type AnalysisScope = (typeof AnalysisScopes)[number];

export const MetricNames = ['latency', 'total_loss', 'total_orl', 'fiber_event_loss', 'fiber_event_reflectance', 'fiber_section_loss', 'fiber_section_attenuation'] as const;
export type MetricName = (typeof MetricNames)[number];

export interface ICumulativeStats {
    dataPoints: DataPoint[] | null;
}

export interface IFiberEventOrSectionStats {
  metrics: {
    index: number;
    dataPoints: DataPoint[] | null;
  }[];
}

export interface ICachedStats {
  time: Date | null,
  timeRange: TimeRange | null;
  analysisScope: AnalysisScope | null;
  monitoringPortId?: number;
  stats: ICumulativeStats | IFiberEventOrSectionStats | null;
  alarms: MonitoringAlarmEvent[] | null;
}

export interface QuickAnalysisState {
  cachedStats: ICachedStats;
  cumulativeStats: ICumulativeStats;
  fiberSectionStats: IFiberEventOrSectionStats;
  fiberEventStats: IFiberEventOrSectionStats;
  timeRange: TimeRange;
  analysisScope: AnalysisScope;
  hiddenCharts: string[];
  otauPortPath: OtauPortPath | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
