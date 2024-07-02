import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class PrometheusService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.PrometheusClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.PrometheusClient(transport);
  }

  getCumulativeStats(timeRange: string, monitoringPortId: number, metricName: string): Observable<grpc.GetCumulativeStatsResponse> {
    const request: grpc.GetCumulativeStatsRequest = { metricName, timeRange, monitoringPortId };
    return GrpcUtils.unaryToObservable(
      this.client.getCumulativeStats.bind(this.client),
      request,
      {}
    );
  }

  getFiberSectionStats(timeRange: string, monitoringPortId: number, metricName: string): Observable<grpc.GetFiberSectionStatsResponse> {
    const request: grpc.GetFiberSectionStatsRequest = { metricName, timeRange, monitoringPortId };
    return GrpcUtils.unaryToObservable(
      this.client.getFiberSectionStats.bind(this.client),
      request,
      {}
    );
  }

  getFiberEventStats(timeRange: string, monitoringPortId: number, metricName: string): Observable<grpc.GetFiberEventStatsResponse> {
    const request: grpc.GetFiberEventStatsRequest = { metricName, timeRange, monitoringPortId };
    return GrpcUtils.unaryToObservable(
      this.client.getFiberEventStats.bind(this.client),
      request,
      {}
    );
  }
}
