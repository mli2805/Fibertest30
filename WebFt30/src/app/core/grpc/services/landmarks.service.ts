import { inject, Injectable } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';
import { Observable } from 'rxjs';
import { ColoredLandmark } from '../../store/models/ft30/colored-landmark';
import { LandmarksMapping } from '../../store/mapping/landmarks-mapping';

@Injectable({
  providedIn: 'root'
})
export class LandmarksService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.LandmarksClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.LandmarksClient(transport);
  }

  getLandmarksModel(landmarksModelId: string): Observable<grpc.GetLandmarksModelResponse> {
    const request: grpc.GetLandmarksModelRequest = { landmarksModelId };
    return GrpcUtils.unaryToObservable(
      this.client.getLandmarksModel.bind(this.client),
      request,
      {}
    );
  }

  deleteLandmarksModel(landmarksModelId: string): Observable<grpc.DeleteLandmarksModelResponse> {
    const request: grpc.DeleteLandmarksModelRequest = { landmarksModelId };
    return GrpcUtils.unaryToObservable(
      this.client.deleteLandmarksModel.bind(this.client),
      request,
      {}
    );
  }

  createLandmarksModel(
    landmarksModelId: string,
    traceId: string
  ): Observable<grpc.CreateLandmarksModelResponse> {
    const request: grpc.CreateLandmarksModelRequest = {
      landmarksModelId,
      traceId
    };
    return GrpcUtils.unaryToObservable(
      this.client.createLandmarksModel.bind(this.client),
      request,
      {}
    );
  }

  updateLandmarksModel(
    landmarksModelId: string,
    changedLandmark: ColoredLandmark | undefined,
    isFilterOn: boolean | undefined
  ) {
    const request: grpc.UpdateLandmarksModelRequest = {
      landmarksModelId,
      changedLandmark: changedLandmark
        ? LandmarksMapping.toGrpcColoredLandmark(changedLandmark!)
        : undefined,
      isFilterOn
    };
    return GrpcUtils.unaryToObservable(
      this.client.updateLandmarksModel.bind(this.client),
      request,
      {}
    );
  }

  clearLandmarksModel(landmarksModelId: string) {
    const request: grpc.ClearLandmarksModelRequest = { landmarksModelId };
    return GrpcUtils.unaryToObservable(
      this.client.clearLandmarksModel.bind(this.client),
      request,
      {}
    );
  }
}
