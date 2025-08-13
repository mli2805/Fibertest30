import { inject, Injectable } from '@angular/core';
import * as gprc from 'src/grpc-generated';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private authInterceptor = inject(AuthInterceptor);
  private client: gprc.ReportsClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new gprc.ReportsClient(transport);
  }

  getUserActionLines(): Observable<gprc.GetUserActionLinesResponse> {
    const request: gprc.GetUserActionLinesRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getUserActionLines.bind(this.client),
      request,
      {}
    );
  }
}
