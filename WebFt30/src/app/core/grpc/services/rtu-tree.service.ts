import { Injectable, inject } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import * as grpc from 'src/grpc-generated';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import { Observable } from 'rxjs';
import { AttachTraceDto } from '../../store/models/ft30/attach-trace-dto';
import { FtBaseMapping } from '../../store/mapping/ft-base-mapping';
import { AttachOtauDto } from '../../store/models/ft30/attach-otau-dto';
import { DetachOtauDto } from '../../store/models/ft30/detach-otau-dto';

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

  attachOtau(dto: AttachOtauDto): Observable<grpc.AttachOtauResponse> {
    const request: grpc.AttachOtauRequest = {
      rtuId: dto.rtuId,
      netAddress: FtBaseMapping.toGrpcNetAddress(dto.netAddress),
      opticalPort: dto.opticalPort
    };
    return GrpcUtils.unaryToObservable(this.client.attachOtau.bind(this.client), request, {});
  }

  detachOtau(dto: DetachOtauDto): Observable<grpc.DetachOtauResponse> {
    const request: grpc.DetachOtauRequest = {
      rtuId: dto.rtuId,
      otauId: dto.otauId,
      netAddress: FtBaseMapping.toGrpcNetAddress(dto.netAddress),
      opticalPort: dto.opticalPort
    };
    return GrpcUtils.unaryToObservable(this.client.detachOtau.bind(this.client), request, {});
  }

  getTraceBaselineState(traceId: string): Observable<grpc.GetTraceBaselineStatResponse> {
    const request: grpc.GetTraceBaselineStatRequest = { traceId };
    return GrpcUtils.unaryToObservable(
      this.client.getTraceBaselineStat.bind(this.client),
      request,
      {}
    );
  }

  getTraceStatistics(traceId: string): Observable<grpc.GetTraceStatisticsResponse> {
    const request: grpc.GetTraceStatisticsRequest = { traceId };
    return GrpcUtils.unaryToObservable(
      this.client.getTraceStatistics.bind(this.client),
      request,
      {}
    );
  }

  getTraceLastMeasurement(traceId: string): Observable<grpc.GetTraceLastMeasurementResponse> {
    const request: grpc.GetTraceLastMeasurementRequest = { traceId };
    return GrpcUtils.unaryToObservable(
      this.client.getTraceLastMeasurement.bind(this.client),
      request,
      {}
    );
  }

  getRtuCurrentStep(rtuId: string): Observable<grpc.GetRtuCurrentStepResponse> {
    const request: grpc.GetRtuCurrentStepRequest = { rtuId };
    return GrpcUtils.unaryToObservable(
      this.client.getRtuCurrentStep.bind(this.client),
      request,
      {}
    );
  }
}
