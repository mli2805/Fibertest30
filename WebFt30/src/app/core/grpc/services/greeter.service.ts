import { Injectable, inject } from '@angular/core';
import { Observable, mergeWith } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class GreeterService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.GreeterClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.GreeterClient(transport);
  }

  sayHello(name: string): Observable<grpc.HelloResponse> {
    const request: grpc.HelloRequest = { name };
    return GrpcUtils.unaryToObservable(this.client.sayHello.bind(this.client), request, {});
  }

  streamHello(name: string): Observable<grpc.HelloResponse> {
    const request: grpc.HelloRequest = { name };
    return GrpcUtils.streamToObservable(this.client.streamHello.bind(this.client), request, {});
  }
}
