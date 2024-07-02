import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest, debounceTime } from 'rxjs';

import { Chart, TimeUnit } from 'chart.js/auto';
import 'chartjs-adapter-moment';

import { AppState, SettingsSelectors, AppTheme, ColorPalleteService } from 'src/app/core';
import { AlarmEventsActions } from 'src/app/core/store/alarm-events/alarm-events.actions';
import { AlarmEventsSelectors } from 'src/app/core/store/alarm-events/alarm-events.selectors';
import { QuickAnalysisActions } from 'src/app/core/store/quick-analysis/quick-analysis.actions';
import { QuickAnalysisSelectors } from 'src/app/core/store/quick-analysis/quick-analysis.selectors';
import { DataPoint } from 'src/app/core/store/models';
import { CoreUtils } from 'src/app/core/core.utils';
import {
  AnalysisScope,
  ICumulativeStats,
  IFiberEventOrSectionStats,
  TimeRange
} from 'src/app/core/store/quick-analysis/quick-analysis.state';

import {
  MonitoringAlarmEvent,
  MonitoringAlarmStatus
} from 'src/app/core/store/models/monitoring-alarm-event';

export interface IChartDrawParameters {
  useCache: boolean;
  invalidateCache: boolean;
  monitoringPortId: number;
  timeRange: TimeRange;
  analysisScope: AnalysisScope;
}

interface IDataset {
  label: string;
  data: DataPoint[];
  lineTension: number;
  hidden: boolean;
}

interface IAnnotation {
  xMin: number | null;
  xMax: number | null;
}

@Component({
  selector: 'rtu-quick-analysis-chart',
  templateUrl: 'quick-analysis-chart.component.html',
  styles: [':host { display: flex; flex-grow: 1; }']
})
export class QuickAnalysisChartComponent implements OnDestroy {
  chart: any;
  datasets: IDataset[] = [];

  private _chartDrawParameters?: IChartDrawParameters;

  private _hiddenCharts: string[] = [];

  private cumulativeStats$ = this.store.select(QuickAnalysisSelectors.selectCumulativeStats);
  private fiberSectionStats$ = this.store.select(QuickAnalysisSelectors.selectFiberSectionStats);
  private fiberEventStats$ = this.store.select(QuickAnalysisSelectors.selectFiberEventStats);
  private selectedTheme$ = this.store.select(SettingsSelectors.selectTheme);

  private alarmEvents$ = this.store.select(AlarmEventsSelectors.selectAlarmEvents);

  private _selectedTheme: AppTheme = 'light';

  @ViewChild('MyChart', { read: ElementRef }) MyChart!: ElementRef;

  private _subscription: Subscription;

  constructor(private store: Store<AppState>, private colorPalleteService: ColorPalleteService) {
    this._hiddenCharts = CoreUtils.getCurrentState(
      this.store,
      QuickAnalysisSelectors.selectHiddenCharts
    );

    this._subscription = this.selectedTheme$.subscribe((appTheme) => {
      this._selectedTheme = appTheme;
      this.applyAppTheme(appTheme);
    });

    this._subscription.add(
      combineLatest([this.cumulativeStats$, this.alarmEvents$])
        .pipe(debounceTime(250))
        .subscribe(([stats, alarms]) => {
          const scope = this._chartDrawParameters?.analysisScope;
          if (scope === 'Latency' || scope === 'Total loss' || scope === 'Total ORL') {
            this.onCumulativeStats(stats, alarms);
            this.putToCache(stats, alarms);
          }
        })
    );
    this._subscription.add(
      combineLatest([this.fiberSectionStats$, this.alarmEvents$])
        .pipe(debounceTime(250))
        .subscribe(([stats, alarms]) => {
          const scope = this._chartDrawParameters?.analysisScope;
          if (scope === 'Section attenuation' || scope === 'Section loss') {
            this.onFiberEventOrSectionStats(stats, alarms);
            this.putToCache(stats, alarms);
          }
        })
    );
    this._subscription.add(
      combineLatest([this.fiberEventStats$, this.alarmEvents$])
        .pipe(debounceTime(250))
        .subscribe(([stats, alarms]) => {
          const scope = this._chartDrawParameters?.analysisScope;
          if (scope === 'Event loss' || scope === 'Event reflectance') {
            this.onFiberEventOrSectionStats(stats, alarms);
            this.putToCache(stats, alarms);
          }
        })
    );
  }

  ngOnDestroy() {
    this._subscription?.unsubscribe();
  }

  public refresh(chartDrawParameters: IChartDrawParameters): void {
    if (
      this._chartDrawParameters &&
      this._chartDrawParameters.analysisScope != chartDrawParameters?.analysisScope
    ) {
      // reset hidden charts
      this._hiddenCharts = [];
      this.store.dispatch(
        QuickAnalysisActions.setHiddenCharts({ hiddenCharts: this._hiddenCharts })
      );
    }

    this._chartDrawParameters = chartDrawParameters;

    if (chartDrawParameters.useCache && !chartDrawParameters.invalidateCache) {
      // -check keys
      // -if match: return from cache
      // -else: update cache

      const state = CoreUtils.getCurrentState(this.store, QuickAnalysisSelectors.selectCachedStats);
      const keyMatch =
        state.monitoringPortId === chartDrawParameters.monitoringPortId &&
        state.analysisScope === chartDrawParameters.analysisScope &&
        state.timeRange === chartDrawParameters.timeRange;

      if (keyMatch) {
        const stats = state.stats;
        const alarms = state.alarms;
        if (stats != null && 'dataPoints' in stats) {
          this.onCumulativeStats(<ICumulativeStats>stats, alarms);
        } else {
          this.onFiberEventOrSectionStats(<IFiberEventOrSectionStats>stats, alarms);
        }
        return;
      }
    }

    const timeRange = this._chartDrawParameters?.timeRange;
    const monitoringPortId = this._chartDrawParameters?.monitoringPortId;

    this.store.dispatch(
      AlarmEventsActions.getAlarmEvents({ monitoringPortIds: [monitoringPortId] })
    );

    switch (this._chartDrawParameters?.analysisScope) {
      case 'Latency': {
        this.store.dispatch(
          QuickAnalysisActions.getCumulativeStats({
            timeRange,
            monitoringPortId,
            metricName: 'latency'
          })
        );
        break;
      }
      case 'Total loss': {
        this.store.dispatch(
          QuickAnalysisActions.getCumulativeStats({
            timeRange,
            monitoringPortId,
            metricName: 'total_loss'
          })
        );
        break;
      }
      case 'Total ORL': {
        this.store.dispatch(
          QuickAnalysisActions.getCumulativeStats({
            timeRange,
            monitoringPortId,
            metricName: 'total_orl'
          })
        );
        break;
      }
      case 'Event loss': {
        this.store.dispatch(
          QuickAnalysisActions.getFiberEventStats({
            timeRange,
            monitoringPortId,
            metricName: 'fiber_event_loss'
          })
        );
        break;
      }
      case 'Event reflectance': {
        this.store.dispatch(
          QuickAnalysisActions.getFiberEventStats({
            timeRange,
            monitoringPortId,
            metricName: 'fiber_event_reflectance'
          })
        );
        break;
      }
      case 'Section loss': {
        this.store.dispatch(
          QuickAnalysisActions.getFiberSectionStats({
            timeRange,
            monitoringPortId,
            metricName: 'fiber_section_loss'
          })
        );
        break;
      }
      case 'Section attenuation': {
        this.store.dispatch(
          QuickAnalysisActions.getFiberSectionStats({
            timeRange,
            monitoringPortId,
            metricName: 'fiber_section_attenuation'
          })
        );
        break;
      }
      default: {
        throw new Error('Not implemented');
      }
    }
  }

  private putToCache(
    stats: ICumulativeStats | IFiberEventOrSectionStats,
    alarms: MonitoringAlarmEvent[] | null
  ) {
    if (!this._chartDrawParameters?.useCache) return;

    this.store.dispatch(
      QuickAnalysisActions.setCachedStats({
        cachedStats: {
          monitoringPortId: this._chartDrawParameters?.monitoringPortId,
          analysisScope: this._chartDrawParameters?.analysisScope,
          timeRange: this._chartDrawParameters?.timeRange,
          time: new Date(),
          stats,
          alarms
        }
      })
    );
  }

  private applyAppTheme(appTheme: AppTheme) {
    if (!this.chart) return;

    const isLight = appTheme == 'light';
    const options = this.chart.config.options;
    options.color = isLight ? undefined : 'white';
    options.scales.x.ticks.color = isLight ? '#666' : 'white';
    options.scales.y.ticks.color = isLight ? '#666' : 'white';
    options.scales.y.title.color = isLight ? '#666' : 'white';
    options.scales.x.grid.color = isLight ? 'rgba(0,0,0,0.1)' : 'gray';
    options.scales.y.grid.color = isLight ? 'rgba(0,0,0,0.1)' : 'gray';

    this.chart.update(); // important!
  }

  private getYUnit(): string {
    switch (this._chartDrawParameters?.analysisScope) {
      case 'Latency':
        return `ns`;
      case 'Event loss':
      case 'Section attenuation':
      case 'Section loss':
      case 'Total loss':
      case 'Total ORL':
        return `dB`;
      case 'Event reflectance':
        return `dB/km`;
      default:
        throw new Error('Unknown units');
    }
  }

  private getLabel(index = -1): string {
    const unit = this.getYUnit();

    switch (this._chartDrawParameters?.analysisScope) {
      case 'Latency':
        return `Latency, ${unit}`;
      case 'Total loss':
        return `Total loss, ${unit}`;
      case 'Total ORL':
        return `Total ORL, ${unit}`;
      case 'Event loss':
        return `Event loss #${index}, ${unit}`;
      case 'Event reflectance':
        return `Event reflectance #${index}, ${unit}`;
      case 'Section loss':
        return `Section loss #${index}, ${unit}`;
      case 'Section attenuation':
        return `Section attenuation #${index}, ${unit}`;
      default:
        throw new Error('Unknown analysisScope');
    }
  }

  private onCumulativeStats(
    cumulativeStats: ICumulativeStats,
    alarms: MonitoringAlarmEvent[] | null = null
  ) {
    if (this.resetAndExit()) return;

    if (!cumulativeStats?.dataPoints) return;
    if (!cumulativeStats?.dataPoints?.length) return;

    const datasets = [
      {
        label: this.getLabel(),
        borderColor: this.colorPalleteService.getBorderColor(),
        backgroundColor: this.colorPalleteService.getBackgroundColor(),
        data: this.handleBigPauses(cumulativeStats.dataPoints!),
        lineTension: 0.5,
        hidden: false
      }
    ];

    this.createChart(datasets, alarms);
  }

  private onFiberEventOrSectionStats(
    fiberEventOrSectionStats: IFiberEventOrSectionStats,
    alarms: MonitoringAlarmEvent[] | null = null
  ) {
    if (this.resetAndExit()) return;

    if (!fiberEventOrSectionStats?.metrics?.length) return;
    if (!fiberEventOrSectionStats.metrics[0].dataPoints?.length) return;

    const datasets = fiberEventOrSectionStats.metrics.map((x) => ({
      label: this.getLabel(x.index),
      borderColor: this.colorPalleteService.getBorderColor(x.index - 1),
      backgroundColor: this.colorPalleteService.getBackgroundColor(x.index - 1),
      data: this.handleBigPauses(x.dataPoints!),
      lineTension: 0.5,
      hidden: false
    }));

    this.createChart(datasets, alarms);
  }

  private resetAndExit(): boolean {
    this.datasets = [];

    if (!this.MyChart?.nativeElement) return true;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    return false;
  }

  private createChart(datasets: IDataset[], alarms: MonitoringAlarmEvent[] | null = null) {
    this.datasets = datasets;

    const timeUnit = this.getTimeUnit();
    const minMaxY = this.getMinMaxY(datasets);

    const annotations = QuickAnalysisChartComponent.getAnotations(datasets[0]?.data[0]?.x, alarms);

    const alarmIntervals = {
      id: 'alarmIntervals',
      beforeDatasetsDraw: (chart: any, args: any, options: any) => {
        const {
          ctx,
          scales: { x },
          chartArea: { top, bottom }
        } = chart;

        annotations.forEach((item) => {
          const strokeStyle = options.lineColor || 'rgba(255, 0, 0, 0.4)';
          const fillStyle = options.fillStyle || 'rgba(255, 0, 0, 0.2)';
          ctx.lineWidth = options.lineWidth || 1;

          const x1 = x.getPixelForValue(item.xMin);
          const x2 = x.getPixelForValue(item.xMax);

          // draw rect
          ctx.strokeStyle = ctx.fillStyle = fillStyle;
          ctx.beginPath();
          ctx.fillRect(x1, bottom, x2 - x1, top - bottom);
          ctx.strokeRect(x1, bottom, x2 - x1, top - bottom);

          // draw 2 vertical lines
          ctx.strokeStyle = strokeStyle;
          ctx.beginPath();
          ctx.moveTo(x1, bottom);
          ctx.lineTo(x1, top);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x2, bottom);
          ctx.lineTo(x2, top);
          ctx.stroke();
        });
      }
    };

    this.chart = new Chart(this.MyChart?.nativeElement, {
      type: 'line',
      data: { datasets },
      options: {
        parsing: false,
        scales: {
          x: {
            ticks: {
              source: 'data'
            },
            type: 'time',
            time: {
              round: 'minute',
              unit: timeUnit
            }
          },
          y: {
            beginAtZero: false,
            suggestedMin: minMaxY.minY - 1,
            suggestedMax: minMaxY.maxY + 1,
            title: {
              display: true,
              text: this.getYUnit()
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            onClick: (e, legendItem, legend) => {
              if (legendItem.hidden) {
                this._hiddenCharts = this._hiddenCharts.filter((hc) => hc !== legendItem.text);
              } else {
                this._hiddenCharts = [...this._hiddenCharts, legendItem.text];
              }
              this.store.dispatch(
                QuickAnalysisActions.setHiddenCharts({ hiddenCharts: this._hiddenCharts })
              );

              // call default handler
              const defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick;
              defaultLegendClickHandler.call(this.chart, e, legendItem, legend);
            }
          },
          decimation: {
            enabled: true,
            algorithm: 'lttb'
            //samples: 200
          }
        }
      },
      plugins: [alarmIntervals]
    });

    this.applyAppTheme(this._selectedTheme);
  }

  private getMinMaxY(datasets: IDataset[]): { minY: number; maxY: number } {
    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;

    for (const ds of datasets) {
      ds.hidden = this._hiddenCharts.indexOf(ds.label) !== -1;

      for (const p of ds.data) {
        if (p.y !== null) {
          minY = Math.min(minY, p.y ?? Number.MAX_VALUE);
          maxY = Math.max(maxY, p.y ?? Number.MIN_VALUE);
        }
      }
    }

    return { minY, maxY };
  }

  private static getAnotations(
    dataPointsStartX: number | null,
    alarms: MonitoringAlarmEvent[] | null
  ): IAnnotation[] {
    const result: IAnnotation[] = [];

    if (dataPointsStartX === null || alarms === null || alarms.length === 0) return result;

    const map = new Map<number, IAnnotation[]>();
    for (let i = alarms.length - 1; i >= 0; --i) {
      let pairs: IAnnotation[] = [];

      const a = alarms[i];
      if (map.has(a.monitoringAlarmId)) {
        pairs = map.get(a.monitoringAlarmId)!;
      } else {
        map.set(a.monitoringAlarmId, pairs);
      }

      if (a.status === MonitoringAlarmStatus.Active) {
        pairs.push({ xMin: a.at.getTime(), xMax: null });
      } else {
        for (const p of pairs) {
          if (p.xMax === null) {
            p.xMax = a.at.getTime();
          }
        }
      }
    }

    for (const pairs of map.values()) {
      for (const p of pairs) {
        if (p.xMax === null) {
          p.xMax = new Date().getTime();
        }
        if (p.xMax < dataPointsStartX!) {
          continue;
        }
        p.xMin = Math.max(dataPointsStartX!, p.xMin!);
        result.push(p);
      }
    }

    // assume all segments are sorted by left end
    result.sort((a, b) => a.xMin! - b.xMin!);

    // find intersections
    let i = 1;
    while (i < result.length) {
      if (result[i - 1].xMax! >= result[i].xMin!) {
        result[i - 1].xMax = Math.max(result[i - 1].xMax!, result[i].xMax!);
        result.splice(i, 1); // delete result[i]
        continue;
      }
      i++;
    }
    return result;
  }

  private getTimeUnit(): TimeUnit {
    switch (this._chartDrawParameters?.timeRange) {
      case '1h':
      case '2h':
        return 'minute';
      case '4h':
      case '12h':
      case '1d':
        return 'hour';
      case '7d':
        return 'day';
      case '30d':
        return 'week';
      default:
        throw new Error(`Unknown time range = ${this._chartDrawParameters?.timeRange}`);
    }
  }

  private getMinPause(): number {
    switch (this._chartDrawParameters?.timeRange) {
      case '1h':
      case '2h':
      case '4h':
      case '12h':
        return 15 * 60000; // 15 minutes in ms
      case '1d':
        return 20 * 60000;
      case '7d':
        return 30 * 60000;
      case '30d':
        return 45 * 60000;
      default:
        throw new Error(`Unknown time range = ${this._chartDrawParameters?.timeRange}`);
    }
  }

  private handleBigPauses(dataPoints: DataPoint[]): DataPoint[] {
    const minPauseSeconds = this.getMinPause();

    const result: DataPoint[] = [];

    let i = 0;
    if (dataPoints.length >= 1) {
      result.push(dataPoints[0]);
    }
    for (i = 1; i < dataPoints.length; ++i) {
      if (dataPoints[i].x! - dataPoints[i - 1].x! > minPauseSeconds) {
        // separator in between
        result.push(new DataPoint());
      }
      result.push(dataPoints[i]);
    }

    const now = new Date().getTime();
    if (dataPoints.length > 1 && now - dataPoints[dataPoints.length - 1].x! > minPauseSeconds) {
      // separator at the end
      result.push({ x: now, y: null });
    }

    return result;
  }
}
