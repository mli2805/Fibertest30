import { Injectable, inject } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import * as grpc from 'src/grpc-generated';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import { Observable } from 'rxjs';
import { AttachTraceDto } from '../../store/models/ft30/attach-trace-dto';
import { FtBaseMapping } from '../../store/mapping/ft-base-mapping';

@Injectable({
  providedIn: 'root'
})
export class RtuTreeService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.RtuTreeClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.RtuTreeClient(transport);
  }

  refreshRtuTree(): Observable<grpc.GetRtuTreeResponse> {
    const request: grpc.GetRtuTreeRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getRtuTree.bind(this.client), request, {});
  }

  getOneRtu(rtuId: string): Observable<grpc.GetRtuResponse> {
    const request: grpc.GetRtuRequest = { rtuId: rtuId };
    return GrpcUtils.unaryToObservable(this.client.getRtu.bind(this.client), request, {});
  }

  attachTrace(dto: AttachTraceDto): Observable<grpc.AttachTraceResponse> {
    const request: grpc.AttachTraceRequest = {
      traceId: dto.traceId,
      portOfOtau: dto.portOfOtau.map((p) => FtBaseMapping.toGrpcPortOfOtau(p))
    };
    return GrpcUtils.unaryToObservable(this.client.attachTrace.bind(this.client), request, {});
  }

  detachTrace(traceId: string): Observable<grpc.DetachTraceResponse> {
    const request: grpc.DetachTraceRequest = { traceId };
    return GrpcUtils.unaryToObservable(this.client.detachTrace.bind(this.client), request, {});
  }
}
