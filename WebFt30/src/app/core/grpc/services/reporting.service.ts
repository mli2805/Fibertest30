import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as gprc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private authInterceptor = inject(AuthInterceptor);
  private client: gprc.ReportingClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new gprc.ReportingClient(transport);
  }

  getSystemEvents(): Observable<gprc.GetSystemEventsResponse> {
    const request: gprc.GetSystemEventsRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getSystemEvents.bind(this.client), request, {});
  }

  getOpticalEvents(): Observable<gprc.GetOpticalEventsResponse> {
    const request: gprc.GetOpticalEventsRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getOpticalEvents.bind(this.client), request, {});
  }
}
