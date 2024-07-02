import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { PrometheusService } from '../../grpc';
import { MapUtils } from '../../map.utils';
import { of } from 'rxjs';
import { QuickAnalysisActions } from './quick-analysis.actions';
import { GrpcUtils } from '../../grpc/grpc.utils';

@Injectable()
export class QuickAnalysisEffects {
  getCumulativeStats = createEffect(() =>
    this.actions$.pipe(
      ofType(QuickAnalysisActions.getCumulativeStats),
      switchMap(({ timeRange, monitoringPortId, metricName }) =>
        this.premetheusService
          .getCumulativeStats(timeRange, monitoringPortId, metricName)
          //.pipe(tap(r => { console.log(r) }))
          .pipe(
            map((response) => {
              const dataPoints = response?.metrics[0]?.dataPoints;

              if (dataPoints?.length) {
                return QuickAnalysisActions.getCumulativeStatsSuccess({
                  dataPoints: MapUtils.toDataPoints(dataPoints)
                });
              }
              return QuickAnalysisActions.getCumulativeStatsSuccess({ dataPoints: [] });
            }),
            catchError((error) =>
              of(
                QuickAnalysisActions.getCumulativeStatsFailure({
                  error: GrpcUtils.toServerError(error)
                })
              )
            )
          )
      )
    )
  );

  getFiberEventStats = createEffect(() =>
    this.actions$.pipe(
      ofType(QuickAnalysisActions.getFiberEventStats),
      switchMap(({ timeRange, monitoringPortId, metricName }) =>
        this.premetheusService
          .getFiberEventStats(timeRange, monitoringPortId, metricName)
          //.pipe(tap(r => { console.log(r) }))
          .pipe(
            map((response) => {
              const metrics = response?.metrics;

              if (metrics?.length) {
                return QuickAnalysisActions.getFiberEventStatsSuccess({
                  metrics: metrics.map((x) => ({
                    index: x.index,
                    dataPoints: MapUtils.toDataPoints(x.dataPoints)
                  }))
                });
              }
              return QuickAnalysisActions.getFiberEventStatsSuccess({ metrics: [] });
            }),
            catchError((error) =>
              of(
                QuickAnalysisActions.getFiberEventStatsFailure({
                  error: GrpcUtils.toServerError(error)
                })
              )
            )
          )
      )
    )
  );

  getFiberSectionStats = createEffect(() =>
    this.actions$.pipe(
      ofType(QuickAnalysisActions.getFiberSectionStats),
      switchMap(({ timeRange, monitoringPortId, metricName }) =>
        this.premetheusService
          .getFiberSectionStats(timeRange, monitoringPortId, metricName)
          //.pipe(tap(r => { console.log(r) }))
          .pipe(
            map((response) => {
              const metrics = response?.metrics;

              if (metrics?.length) {
                return QuickAnalysisActions.getFiberSectionStatsSuccess({
                  metrics: metrics.map((x) => ({
                    index: x.index,
                    dataPoints: MapUtils.toDataPoints(x.dataPoints)
                  }))
                });
              }
              return QuickAnalysisActions.getFiberSectionStatsSuccess({ metrics: [] });
            }),
            catchError((error) =>
              of(
                QuickAnalysisActions.getFiberSectionStatsFailure({
                  error: GrpcUtils.toServerError(error)
                })
              )
            )
          )
      )
    )
  );

  constructor(private actions$: Actions, private premetheusService: PrometheusService) {}
}
