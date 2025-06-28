import { inject, Injectable } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';
import { Observable } from 'rxjs';
import { FtEnumsMapping } from '../../store/mapping/ft-enums-mapping';

@Injectable({
  providedIn: 'root'
})
export class GisService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.GisClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.GisClient(transport);
  }

  getAllGeoData(): Observable<grpc.GetAllGeoDataResponse> {
    const request: grpc.GetAllGeoDataRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getAllGeoData.bind(this.client), request, {});
  }

  getFiberInfo(fiberId: string): Observable<grpc.GetFiberInfoResponse> {
    const request: grpc.GetFiberInfoRequest = { fiberId };
    return GrpcUtils.unaryToObservable(this.client.getFiberInfo.bind(this.client), request, {});
  }

  getLandmarks(traceId: string): Observable<grpc.GetLandmarksResponse> {
    const request: grpc.GetLandmarksRequest = { traceId };
    return GrpcUtils.unaryToObservable(this.client.getLandmarks.bind(this.client), request, {});
  }

  getLandmarksModel(landmarksModelId: string): Observable<grpc.GetLandmarksModelResponse> {
    const request: grpc.GetLandmarksModelRequest = { landmarksModelId };
    return GrpcUtils.unaryToObservable(
      this.client.getLandmarksModel.bind(this.client),
      request,
      {}
    );
  }

  createLandmarksModel(
    landmarksModelId: string,
    traceId: string,
    gpsInputMode: string
  ): Observable<grpc.CreateLandmarksModelResponse> {
    const request: grpc.CreateLandmarksModelRequest = {
      landmarksModelId,
      traceId,
      gpsInputMode: FtEnumsMapping.toGrpcGpsInputMode(gpsInputMode)
    };
    return GrpcUtils.unaryToObservable(
      this.client.createLandmarksModel.bind(this.client),
      request,
      {}
    );
  }
}
