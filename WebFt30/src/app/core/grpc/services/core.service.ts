import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';
import { MonitoringAlarmLevel, SystemEventLevel } from '../../store/models';
import { MapUtils } from '../../map.utils';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.CoreClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.CoreClient(transport);
  }

  getDeviceInfo(): Observable<grpc.DeviceInfoResponse> {
    const request: grpc.DeviceInfoRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getDeviceInfo.bind(this.client), request, {});
  }

  getUserSystemNotifications(): Observable<grpc.GetUserSystemNotificationsResponse> {
    const request: grpc.GetUserSystemNotificationsRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getUserSystemNotifications.bind(this.client),
      request,
      {}
    );
  }

  dismissUserSystemNotification(
    systemEventId: number
  ): Observable<grpc.DismissUserSystemNotificationResponse> {
    const request: grpc.DismissUserSystemNotificationRequest = { systemEventId };
    return GrpcUtils.unaryToObservable(
      this.client.dismissUserSystemNotification.bind(this.client),
      request,
      {}
    );
  }

  getUserAlarmNotifications(): Observable<grpc.GetUserAlarmNotificationsResponse> {
    const request: grpc.GetUserAlarmNotificationsRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getUserAlarmNotifications.bind(this.client),
      request,
      {}
    );
  }

  dismissUserAlarmNotification(
    alarmEventId: number
  ): Observable<grpc.DismissUserAlarmNotificationResponse> {
    const request: grpc.DismissUserAlarmNotificationRequest = { alarmEventId };
    return GrpcUtils.unaryToObservable(
      this.client.dismissUserAlarmNotification.bind(this.client),
      request,
      {}
    );
  }

  dismissUserAlarmNotificationsByLevel(
    alarmLevel: MonitoringAlarmLevel
  ): Observable<grpc.DismissUserAlarmNotificationsByLevelResponse> {
    const request: grpc.DismissUserAlarmNotificationsByLevelRequest = {
      alarmLevel: MapUtils.toGrpcMonitoringAlarmLevel(alarmLevel)
    };
    return GrpcUtils.unaryToObservable(
      this.client.dismissUserAlarmNotificationsByLevel.bind(this.client),
      request,
      {}
    );
  }

  dismissAllUserAlarmNotifications(): Observable<grpc.DismissAllUserAlarmNotificationsResponse> {
    const request: grpc.DismissAllUserAlarmNotificationsRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.dismissAllUserAlarmNotifications.bind(this.client),
      request,
      {}
    );
  }

  dismissUserSystemNotificationsByLevel(
    systemEventLevel: SystemEventLevel
  ): Observable<grpc.DismissUserSystemNotificationsByLevelResponse> {
    const request: grpc.DismissUserSystemNotificationsByLevelRequest = {
      systemEventLevel: MapUtils.toGrpcSystemEventLevel(systemEventLevel)
    };
    return GrpcUtils.unaryToObservable(
      this.client.dismissUserSystemNotificationsByLevel.bind(this.client),
      request,
      {}
    );
  }

  dismissAllUserSystemNotifications(): Observable<grpc.DismissAllUserSystemNotificationsResponse> {
    const request: grpc.DismissAllUserSystemNotificationsRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.dismissAllUserSystemNotifications.bind(this.client),
      request,
      {}
    );
  }

  getSystemMessageStream(): Observable<grpc.GetSystemMessageStreamResponse> {
    const request: grpc.GetSystemMessageStreamRequest = {};
    return GrpcUtils.streamToObservable(
      this.client.getSystemMessageStream.bind(this.client),
      request,
      {}
    );
  }
}
