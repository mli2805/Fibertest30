import { inject, Injectable } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RftsEventsService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.RftsEventsClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.RftsEventsClient(transport);
  }

  getRftsEvents(sorFileId: number): Observable<grpc.GetRftsEventsResponse> {
    const request: grpc.GetRftsEventsRequest = { sorFileId };
    return GrpcUtils.unaryToObservable(this.client.getRftsEvents.bind(this.client), request, {});
  }
}
