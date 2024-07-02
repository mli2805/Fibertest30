import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as gprc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class PortLabelingService {
  private authInterceptor = inject(AuthInterceptor);
  private client: gprc.PortLabelingClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new gprc.PortLabelingClient(transport);
  }

  addAndAttachPortLabel(
    name: string,
    hexColor: string,
    monitoringPortId: number
  ): Observable<gprc.AddAndAttachPortLabelResponse> {
    const request: gprc.AddAndAttachPortLabelRequest = { name, hexColor, monitoringPortId };
    return GrpcUtils.unaryToObservable(
      this.client.addAndAttachPortLabel.bind(this.client),
      request,
      {}
    );
  }

  attachPortLabel(
    portLabelId: number,
    monitoringPortId: number
  ): Observable<gprc.AttachPortLabelResponse> {
    const request: gprc.AttachPortLabelRequest = { portLabelId, monitoringPortId };
    return GrpcUtils.unaryToObservable(this.client.attachPortLabel.bind(this.client), request, {});
  }

  detachPortLabelAndRemoveIfLast(
    portLabelId: number,
    monitoringPortId: number
  ): Observable<gprc.DetachPortLabelAndRemoveIfLastResponse> {
    const request: gprc.DetachPortLabelAndRemoveIfLastRequest = { portLabelId, monitoringPortId };
    return GrpcUtils.unaryToObservable(
      this.client.detachPortLabelAndRemoveIfLast.bind(this.client),
      request,
      {}
    );
  }
}
