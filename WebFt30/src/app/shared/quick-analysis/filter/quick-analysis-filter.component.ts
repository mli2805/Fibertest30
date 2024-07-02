import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, OtausSelectors } from 'src/app/core';
import { QuickAnalysisActions } from 'src/app/core/store/quick-analysis/quick-analysis.actions';
import { QuickAnalysisSelectors } from 'src/app/core/store/quick-analysis/quick-analysis.selectors';
import { OtauPortPath } from 'src/app/core/store/models';
import { CoreUtils } from 'src/app/core/core.utils';
import { AnalysisScope, TimeRange } from 'src/app/core/store/quick-analysis/quick-analysis.state';
import { IChartDrawParameters } from '../chart/quick-analysis-chart.component';

@Component({
  selector: 'rtu-quick-analysis-filter',
  templateUrl: 'quick-analysis-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickAnalysisFilterComponent implements AfterViewInit {
  @Input() useCache = false;
  @Input() presetMonitoringPortId?: number;

  @Output() filterChanged = new EventEmitter<IChartDrawParameters>();

  cacheTime: Date | null = null;

  monitoringPortId!: number;

  timeRange: TimeRange = '1h';
  timeRanges: TimeRange[] = ['1h', '2h', '4h', '12h', '1d', '7d', '30d'];

  analysisScope: AnalysisScope = 'Latency';
  analysisScopes: AnalysisScope[] = [
    'Latency',
    'Total loss',
    'Total ORL',
    'Event loss',
    'Event reflectance',
    'Section loss',
    'Section attenuation'
  ];

  allOnlineOnPorts$ = this.store.select(OtausSelectors.selectAllOnlineOnPorts);
  otauPortPath$ = this.store.select(QuickAnalysisSelectors.selectOtauPortPath);

  constructor(private store: Store<AppState>) {
    this.timeRange = CoreUtils.getCurrentState(this.store, QuickAnalysisSelectors.selectTimeRange);
    this.analysisScope = CoreUtils.getCurrentState(
      this.store,
      QuickAnalysisSelectors.selectAnalysisScope
    );

    this.initOtauPortPath();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let invalidateCache = false;

      if (this.useCache) {
        const state = CoreUtils.getCurrentState(
          this.store,
          QuickAnalysisSelectors.selectCachedStats
        );

        const keyMatch =
          state.monitoringPortId === this.monitoringPortId &&
          state.analysisScope === this.analysisScope &&
          state.timeRange === this.timeRange;

        if (keyMatch) {
          this.cacheTime = state.time;
        } else {
          invalidateCache = true;
        }
      }

      this.triggerEvent(invalidateCache);
    }, 100); // delay just in case
  }

  private initOtauPortPath() {
    let otauPortPath = CoreUtils.getCurrentState(
      this.store,
      QuickAnalysisSelectors.selectOtauPortPath
    );

    const allPorts = CoreUtils.getCurrentState(this.store, OtausSelectors.selectAllOnlineOnPorts);
    if (otauPortPath == null && allPorts.length > 0) {
      otauPortPath = allPorts[0];
      this.store.dispatch(QuickAnalysisActions.setOtauPortPath({ otauPortPath: allPorts[0] }));
    }

    if (otauPortPath) {
      this.monitoringPortId = otauPortPath.monitoringPortId;
    }
  }

  setTimeRange(timeRange: TimeRange) {
    this.store.dispatch(QuickAnalysisActions.setTimeRange({ timeRange }));
    this.timeRange = timeRange;
    this.triggerEvent(this.useCache);
  }

  setAnalysisScope(analysisScope: AnalysisScope) {
    this.store.dispatch(QuickAnalysisActions.setAnalysisScope({ analysisScope }));
    this.analysisScope = analysisScope;
    this.triggerEvent(this.useCache);
  }

  setTestPort(otauPortPath: OtauPortPath) {
    this.store.dispatch(QuickAnalysisActions.setOtauPortPath({ otauPortPath }));
    this.monitoringPortId = otauPortPath.monitoringPortId;
    this.triggerEvent(this.useCache);
  }

  refresh() {
    this.triggerEvent(true);
  }

  private triggerEvent(invalidateCache = false) {
    this.filterChanged.emit({
      useCache: this.useCache,
      invalidateCache,
      timeRange: this.timeRange,
      monitoringPortId:
        this.presetMonitoringPortId !== undefined
          ? this.presetMonitoringPortId
          : this.monitoringPortId,
      analysisScope: this.analysisScope
    });

    if (invalidateCache) this.cacheTime = new Date();
  }
}
