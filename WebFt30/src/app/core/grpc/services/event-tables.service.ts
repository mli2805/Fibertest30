import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as gprc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class EventTablesService {
  private authInterceptor = inject(AuthInterceptor);
  private client: gprc.EventTablesClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new gprc.EventTablesClient(transport);
  }

  getSystemEvents(): Observable<gprc.GetSystemEventsResponse> {
    const request: gprc.GetSystemEventsRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getSystemEvents.bind(this.client), request, {});
  }

  getOpticalEvents(currentEvents: boolean): Observable<gprc.GetOpticalEventsResponse> {
    const request: gprc.GetOpticalEventsRequest = { currentEvents };
    return GrpcUtils.unaryToObservable(this.client.getOpticalEvents.bind(this.client), request, {});
  }

  getNetworkEvents(currentEvents: boolean): Observable<gprc.GetNetworkEventsResponse> {
    const request: gprc.GetNetworkEventsRequest = { currentEvents };
    return GrpcUtils.unaryToObservable(this.client.getNetworkEvents.bind(this.client), request, {});
  }

  getBopEvents(currentEvents: boolean): Observable<gprc.GetBopEventsResponse> {
    const request: gprc.GetBopEventsRequest = { currentEvents };
    return GrpcUtils.unaryToObservable(this.client.getBopEvents.bind(this.client), request, {});
  }

  getRtuAccidents(currentAccidents: boolean): Observable<gprc.GetRtuAccidentsResponse> {
    const request: gprc.GetRtuAccidentsRequest = { currentAccidents };
    return GrpcUtils.unaryToObservable(this.client.getRtuAccidents.bind(this.client), request, {});
  }
}
