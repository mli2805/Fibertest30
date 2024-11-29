import { Injectable, inject } from '@angular/core';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import * as grpc from 'src/grpc-generated';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import { Observable } from 'rxjs';
import { NetAddress } from '../../store/models/ft30/net-address';
import { FtBaseMapping } from '../../store/mapping/ft-base-mapping';
import { InitializeRtuDto } from '../../store/models/ft30/initialize-rtu-dto';
import { DoMeasurementClientDto } from '../../store/models/ft30/do-measurement-client-dto';
import { RtuMgmtMapping } from '../../store/mapping/rtu-mgmt-mapping';
import { ApplyMonitoringSettingsDto } from '../../store/models/ft30/apply-monitorig-settings-dto';
import { AssignBaseRefsDto } from '../../store/models/ft30/assign-base-refs-dto';

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

  initializeRtu(dto: InitializeRtuDto): Observable<grpc.InitializeRtuResponse> {
    const request: grpc.InitializeRtuRequest = { dto };
    return GrpcUtils.unaryToObservable(this.client.initializeRtu.bind(this.client), request, {});
  }

  startMeasurementClient(dto: DoMeasurementClientDto): Observable<grpc.EmptyResponse> {
    const grpcDto = RtuMgmtMapping.toGrpcDoClientMeasurementDto(dto);
    const request: grpc.DoMeasurementClientRequest = { dto: grpcDto };
    return GrpcUtils.unaryToObservable(
      this.client.doMeasurementClient.bind(this.client),
      request,
      {}
    );
  }

  getMeasurementClientSor(measurementClientId: string): Observable<grpc.GetSorResponse> {
    const request: grpc.GetMeasurementClientSorRequest = {
      measurementClientId: measurementClientId
    };
    return GrpcUtils.unaryToObservable(
      this.client.getMeasurementClientSor.bind(this.client),
      request,
      {}
    );
  }

  getMeasurementSor(sorFileId: number): Observable<grpc.GetSorResponse> {
    const request: grpc.GetMeasurementSorRequest = {
      sorFileId
    };
    return GrpcUtils.unaryToObservable(
      this.client.getMeasurementSor.bind(this.client),
      request,
      {}
    );
  }

  applyMonitoringSettings(
    dto: ApplyMonitoringSettingsDto
  ): Observable<grpc.ApplyMonitoringSettingsResponse> {
    const request: grpc.ApplyMonitoringSettingsRequest = {
      dto: RtuMgmtMapping.toGrpcApplyMonitoringSettingsDto(dto)
    };
    return GrpcUtils.unaryToObservable(
      this.client.applyMonitoringSettings.bind(this.client),
      request,
      {}
    );
  }

  assignBaseRefs(dto: AssignBaseRefsDto): Observable<grpc.AssignBaseRefsResponse> {
    const request: grpc.AssignBaseRefsRequest = {
      dto: RtuMgmtMapping.toGrpcAssingBaseRefsDto(dto)
    };
    return GrpcUtils.unaryToObservable(this.client.assignBaseRefs.bind(this.client), request, {});
  }

  stopMonitoring(rtuId: string): Observable<grpc.EmptyResponse> {
    const request: grpc.StopMonitoringRequest = { rtuId };
    return GrpcUtils.unaryToObservable(this.client.stopMonitoring.bind(this.client), request, {});
  }
}
