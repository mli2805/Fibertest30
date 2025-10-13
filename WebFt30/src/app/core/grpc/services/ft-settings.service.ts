import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, throwError, timer } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class FtSettingsService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.FtSettingsClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.FtSettingsClient(transport);
  }

  updateNotificationSettings(
    grpcNotificationSettings: grpc.NotificationSettings
  ): Observable<grpc.UpdateNotificationSettingsResponse> {
    const request: grpc.UpdateNotificationSettingsRequest = {
      notificationSettings: grpcNotificationSettings
    };

    return GrpcUtils.unaryToObservable(
      this.client.updateNotificationSettings.bind(this.client),
      request,
      {}
    );
  }

  refreshNotificationSettings(): Observable<grpc.GetNotificationSettingsResponse> {
    const request: grpc.GetNotificationSettingsRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getNotificationSettings.bind(this.client),
      request,
      {}
    );
  }

  testEmailServerSettings(
    grpcEmailServer: grpc.EmailServer
  ): Observable<grpc.TestEmailServerSettingsResponse> {
    const request: grpc.TestEmailServerSettingsRequest = { emailServer: grpcEmailServer };

    return GrpcUtils.unaryToObservable(
      this.client.testEmailServerSettings.bind(this.client),
      request,
      {}
    );
  }

  testTrapReceiverSettins(
    grpcTrapReceiver: grpc.TrapReceiver
  ): Observable<grpc.TestTrapReceiverSettingsResponse> {
    const request: grpc.TestTrapReceiverSettingsRequest = { trapReceiver: grpcTrapReceiver };

    return GrpcUtils.unaryToObservable(
      this.client.testTrapReceiverSettings.bind(this.client),
      request,
      {}
    );
  }

  getLogBundle(): Observable<grpc.GetLogBundleResponse> {
    const request: grpc.GetLogBundleRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getLogBundle.bind(this.client), request, {});
  }
}
