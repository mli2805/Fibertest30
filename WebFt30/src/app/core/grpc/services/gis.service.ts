import { inject, Injectable } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GisService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.GisClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.GisClient(transport);
  }

  getTraceRoute(traceId: string): Observable<grpc.GetTraceRouteResponse> {
    const request: grpc.GetTraceRouteRequest = { traceId };
    return GrpcUtils.unaryToObservable(this.client.getTraceRoute.bind(this.client), request, {});
  }

  getGraphRoutes(): Observable<grpc.GetGraphRoutesResponse> {
    const request: grpc.GetGraphRoutesRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getGraphRoutes.bind(this.client), request, {});
  }

  getAllGeoData(): Observable<grpc.GetAllGeoDataResponse> {
    const request: grpc.GetAllGeoDataRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getAllGeoData.bind(this.client), request, {});
  }
}
