import { Injectable, inject } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import * as grpc from 'src/grpc-generated';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import { Observable } from 'rxjs';
import { NetAddress } from '../../store/models/ft30/net-address';
import { FtBaseMapping } from '../../store/mapping/ft-base-mapping';

@Injectable({
  providedIn: 'root'
})
export class RtuMgmtService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.RtuMgmtClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.RtuMgmtClient(transport);
  }

  testRtuConnection(netAddress: NetAddress): Observable<grpc.TestRtuConnectionResponse> {
    const grpcNetAddress = FtBaseMapping.toGrpcNetAddress(netAddress);
    const request: grpc.TestRtuConnectionRequest = { netAddress: grpcNetAddress };
    return GrpcUtils.unaryToObservable(
      this.client.testRtuConnection.bind(this.client),
      request,
      {}
    );
  }
}
