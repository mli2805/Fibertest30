import { inject, Injectable } from '@angular/core';
import * as gprc from 'src/grpc-generated';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { Observable } from 'rxjs';
import { DateTimeRange } from 'src/grpc-generated';
import { EventStatus, FiberState } from '../../store/models/ft30/ft-enums';
import { FtEnumsMapping } from '../../store/mapping/ft-enums-mapping';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private authInterceptor = inject(AuthInterceptor);
  private client: gprc.ReportsClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new gprc.ReportsClient(transport);
  }

  getUserActionLines(
    userId: string,
    searchWindow: DateTimeRange,
    operationCodes: number[]
  ): Observable<gprc.GetUserActionLinesResponse> {
    const request: gprc.GetUserActionLinesRequest = {
      userId,
      dateTimeFilter: { searchWindow: searchWindow, orderDescending: true },
      operationCodes
    };
    return GrpcUtils.unaryToObservable(
      this.client.getUserActionLines.bind(this.client),
      request,
      {}
    );
  }

  getUserActionsPdf(
    userId: string,
    searchWindow: DateTimeRange,
    operationCodes: number[]
  ): Observable<gprc.GetUserActonsPdfResponse> {
    const request: gprc.GetUserActionLinesRequest = {
      userId,
      dateTimeFilter: { searchWindow: searchWindow, orderDescending: true },
      operationCodes
    };
    return GrpcUtils.unaryToObservable(this.client.getUserActonsPdf.bind(this.client), request, {});
  }

  getOpticalEventsReportPdf(
    isCurrentEvents: boolean,
    searchWindow: DateTimeRange,
    eventStatuses: EventStatus[],
    traceStates: FiberState[],
    isDetailed: boolean,
    isShowPlace: boolean
  ): Observable<gprc.GetOpticalEventsReportPdfResponse> {
    const request: gprc.GetOpticalEventsReportPdfRequest = {
      isCurrentEvents,
      dateTimeFilter: { searchWindow: searchWindow, orderDescending: true },
      eventStatuses,
      traceStates: traceStates.map((s) => FtEnumsMapping.toGrpcFiberState(s)),
      isDetailed,
      isShowPlace
    };
    return GrpcUtils.unaryToObservable(
      this.client.getOpticalEventsReportPdf.bind(this.client),
      request,
      {}
    );
  }

  getMonitoringSystemReportPdf(): Observable<gprc.GetMonitoringSystemReportPdfResposne> {
    const request: gprc.GetMonitoringSystemReportPdfRequest = {};
    return GrpcUtils.unaryToObservable(
      this.client.getMonitoringSystemReportPdf.bind(this.client),
      request,
      {}
    );
  }
}
