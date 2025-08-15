import { inject, Injectable } from '@angular/core';
import * as gprc from 'src/grpc-generated';
import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { Observable } from 'rxjs';
import { DateTimeRange } from 'src/grpc-generated';

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
}
