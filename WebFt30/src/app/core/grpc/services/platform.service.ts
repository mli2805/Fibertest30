import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.PlatformClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.PlatformClient(transport);
  }
}
