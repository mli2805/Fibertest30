import { Injectable, inject } from '@angular/core';
import { AuthInterceptor } from '../auth.interceptor';
import * as grpc from 'src/grpc-generated';
import { GrpcUtils } from '../grpc.utils';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.GraphClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.GraphClient(transport);
  }

  sendCommand(command: string, commandType: string): Observable<grpc.SendCommandResponse> {
    const request: grpc.SendCommandRequest = { command, commandType };
    return GrpcUtils.unaryToObservable(this.client.sendCommand.bind(this.client), request, {});
  }
}
