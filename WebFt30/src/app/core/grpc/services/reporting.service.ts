import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as gprc from 'src/grpc-generated';
import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';
import { Duration } from 'src/grpc-generated/google/protobuf/duration';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private authInterceptor = inject(AuthInterceptor);
  private client: gprc.ReportingClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new gprc.ReportingClient(transport);
  }

  getSystemEvents(): Observable<gprc.GetSystemEventsResponse> {
    const request: gprc.GetSystemEventsRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getSystemEvents.bind(this.client), request, {});
  }

  getMonitorings(
    since: Date | null,
    monitoringPortIds: number[],
    orderDescending: boolean
  ): Observable<gprc.GetMonitoringsResponse> {
    const tmpRelativeFromNow = Duration.create();
    tmpRelativeFromNow.seconds = '' + 5 * 365 * 12 * 3600;

    const request: gprc.GetMonitoringsRequest = {
      monitoringPortIds,
      dateTimeFilter: {
        // TMP comment:

        // either searchWindow or relativeFromNow must be set, but not both
        // in searchWindow pass Utc datetimes

        // It could be handy to create DateTimeFilter class and pass all related props together,
        // in a similar way like Backend utilizes it (see Rfts400.Application.DateTimeFilter)

        // Looks like this DateTimeFilter will be reused for all reporting pages
        // All the hints from backend's DateTimeFilter class (about inclusive, exclusive)
        // also make sense to duplicate here, in the frontend side.

        searchWindow: undefined,
        relativeFromNow: tmpRelativeFromNow, // tmp set to make filtering work
        loadSince: since ? Timestamp.fromDate(since) : undefined,
        orderDescending: orderDescending
      }
    };
    return GrpcUtils.unaryToObservable(this.client.getMonitorings.bind(this.client), request, {});
  }

  getMonitoring(monitoringId: number): Observable<gprc.GetMonitoringResponse> {
    const request: gprc.GetMonitoringRequest = { monitoringId };
    return GrpcUtils.unaryToObservable(this.client.getMonitoring.bind(this.client), request, {});
  }

  getMonitoringTrace(
    monitoringId: number,
    vxsorFormat = true
  ): Observable<gprc.GetMonitoringTraceResponse> {
    const request: gprc.GetMonitoringTraceRequest = { monitoringId, vxsorFormat };
    return GrpcUtils.unaryToObservable(
      this.client.getMonitoringTrace.bind(this.client),
      request,
      {}
    );
  }

  getMonitoringLinkmap(monitoringId: number): Observable<gprc.GetMonitoringLinkmapResponse> {
    const defaultMacrobendThreshold = 0.2;
    const request: gprc.GetMonitoringLinkmapRequest = {
      monitoringId,
      macrobendThreshold: defaultMacrobendThreshold
    };
    return GrpcUtils.unaryToObservable(
      this.client.getMonitoringLinkmap.bind(this.client),
      request,
      {}
    );
  }

  getBaselines(monitoringPortIds: number[]): Observable<gprc.GetBaselinesResponse> {
    const request: gprc.GetBaselinesRequest = { monitoringPortIds };
    return GrpcUtils.unaryToObservable(this.client.getBaselines.bind(this.client), request, {});
  }

  getBaseline(baselineId: number): Observable<gprc.GetBaselineResponse> {
    const request: gprc.GetBaselineRequest = { baselineId };
    return GrpcUtils.unaryToObservable(this.client.getBaseline.bind(this.client), request, {});
  }

  getMonitoringTraceAndBase(
    monitoringId: number
  ): Observable<gprc.GetMonitoringTraceAndBaseResponse> {
    const request: gprc.GetMonitoringTraceAndBaseRequest = {
      monitoringId,
      vxsorFormat: false
    };
    return GrpcUtils.unaryToObservable(
      this.client.getMonitoringTraceAndBase.bind(this.client),
      request,
      {}
    );
  }

  getBaselineTrace(
    baselineId: number,
    vxsorFormat = true
  ): Observable<gprc.GetBaselineTraceResponse> {
    const request: gprc.GetBaselineTraceRequest = { baselineId, vxsorFormat };
    return GrpcUtils.unaryToObservable(this.client.getBaselineTrace.bind(this.client), request, {});
  }

  getBaselineLinkmap(baselineId: number): Observable<gprc.GetBaselineLinkmapResponse> {
    const defaultMacrobendThreshold = 0.2;
    const request: gprc.GetBaselineLinkmapRequest = {
      baselineId,
      macrobendThreshold: defaultMacrobendThreshold
    };
    return GrpcUtils.unaryToObservable(
      this.client.getBaselineLinkmap.bind(this.client),
      request,
      {}
    );
  }

  getAlarm(id: number): Observable<gprc.GetAlarmResponse> {
    const request: gprc.GetAlarmRequest = { id };
    return GrpcUtils.unaryToObservable(this.client.getAlarm.bind(this.client), request, {});
  }

  getActiveAlarms(): Observable<gprc.GetActiveAlarmsResponse> {
    const request: gprc.GetActiveAlarmsRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getActiveAlarms.bind(this.client), request, {});
  }

  getAllAlarms(monitoringPortIds: number[]): Observable<gprc.GetAllAlarmsResponse> {
    const request: gprc.GetAllAlarmsRequest = { monitoringPortIds };
    return GrpcUtils.unaryToObservable(this.client.getAllAlarms.bind(this.client), request, {});
  }

  getAlarmEvents(monitoringPortIds: number[]): Observable<gprc.GetAlarmEventsResponse> {
    const request: gprc.GetAlarmEventsRequest = { monitoringPortIds };
    return GrpcUtils.unaryToObservable(this.client.getAlarmEvents.bind(this.client), request, {});
  }

  getLastMonitoring(
    monitoringPortId: number,
    baselineId: number
  ): Observable<gprc.GetLastMonitoringResponse> {
    const request: gprc.GetLastMonitoringRequest = { monitoringPortId, baselineId };
    return GrpcUtils.unaryToObservable(
      this.client.getLastMonitoring.bind(this.client),
      request,
      {}
    );
  }

  getLastMonitoringTrace(
    monitoringPortId: number,
    baselineId: number,
    vxsorFormat = true
  ): Observable<gprc.GetLastMonitoringTraceResponse> {
    const request: gprc.GetLastMonitoringTraceRequest = {
      monitoringPortId,
      baselineId,
      vxsorFormat
    };
    return GrpcUtils.unaryToObservable(
      this.client.getLastMonitoringTrace.bind(this.client),
      request,
      {}
    );
  }

  getLastMonitoringLinkmap(
    monitoringPortId: number,
    baselineId: number
  ): Observable<gprc.GetLastMonitoringLinkmapResponse> {
    const defaultMacrobendThreshold = 0.2;
    const request: gprc.GetLastMonitoringLinkmapRequest = {
      monitoringPortId,
      baselineId,
      macrobendThreshold: defaultMacrobendThreshold
    };
    return GrpcUtils.unaryToObservable(
      this.client.getLastMonitoringLinkmap.bind(this.client),
      request,
      {}
    );
  }
}
