import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as gprc from 'src/grpc-generated';
import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';
import { Duration } from 'src/grpc-generated/google/protobuf/duration';
import { DateTimeRange } from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class EventTablesService {
  private authInterceptor = inject(AuthInterceptor);
  private client: gprc.EventTablesClient;

  portionSize = 150;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new gprc.EventTablesClient(transport);
  }

  getSystemEvents(): Observable<gprc.GetSystemEventsResponse> {
    const request: gprc.GetSystemEventsRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getSystemEvents.bind(this.client), request, {});
  }

  // getOpticalEvents(currentEvents: boolean): Observable<gprc.GetOpticalEventsResponse> {
  //   const request: gprc.GetOpticalEventsRequest = { currentEvents };
  //   return GrpcUtils.unaryToObservable(this.client.getOpticalEvents.bind(this.client), request, {});
  // }

  getOpticalEvent(eventId: number): Observable<gprc.GetOpticalEventResponse> {
    const request: gprc.GetOpticalEventRequest = { eventId };
    return GrpcUtils.unaryToObservable(this.client.getOpticalEvent.bind(this.client), request, {});
  }

  getOpticalEvents(
    currentEvents: boolean,
    searchWindow: DateTimeRange | null,
    lastLoaded: Date | null,
    orderDescending: boolean
  ): Observable<gprc.GetOpticalEventsResponse> {
    const tmpRelativeFromNow = Duration.create();
    tmpRelativeFromNow.seconds = '' + 5 * 365 * 12 * 3600;

    const request: gprc.GetOpticalEventsRequest = {
      currentEvents,
      dateTimeFilter: {
        // TMP comment:

        // either searchWindow or relativeFromNow must be set, but not both
        // in searchWindow pass Utc datetimes

        // It could be handy to create DateTimeFilter class and pass all related props together,
        // in a similar way like Backend utilizes it (see Rfts400.Application.DateTimeFilter)

        // Looks like this DateTimeFilter will be reused for all reporting pages
        // All the hints from backend's DateTimeFilter class (about inclusive, exclusive)
        // also make sense to duplicate here, in the frontend side.

        searchWindow: searchWindow ? searchWindow : undefined,
        relativeFromNow: searchWindow ? undefined : tmpRelativeFromNow, // tmp set to make filtering work
        loadSince: lastLoaded ? Timestamp.fromDate(lastLoaded) : undefined,
        orderDescending: orderDescending
      }
    };
    return GrpcUtils.unaryToObservable(this.client.getOpticalEvents.bind(this.client), request, {});
  }

  getNetworkEvents(
    currentEvents: boolean,
    searchWindow: DateTimeRange | null,
    lastLoaded: Date | null,
    orderDescending: boolean
  ): Observable<gprc.GetNetworkEventsResponse> {
    const tmpRelativeFromNow = Duration.create();
    tmpRelativeFromNow.seconds = '' + 5 * 365 * 12 * 3600;

    const request: gprc.GetNetworkEventsRequest = {
      currentEvents,
      dateTimeFilter: {
        // TMP comment:

        // either searchWindow or relativeFromNow must be set, but not both
        // in searchWindow pass Utc datetimes

        // It could be handy to create DateTimeFilter class and pass all related props together,
        // in a similar way like Backend utilizes it (see Rfts400.Application.DateTimeFilter)

        // Looks like this DateTimeFilter will be reused for all reporting pages
        // All the hints from backend's DateTimeFilter class (about inclusive, exclusive)
        // also make sense to duplicate here, in the frontend side.

        searchWindow: searchWindow ? searchWindow : undefined,
        relativeFromNow: searchWindow ? undefined : tmpRelativeFromNow, // tmp set to make filtering work
        loadSince: lastLoaded ? Timestamp.fromDate(lastLoaded) : undefined,
        orderDescending: orderDescending
      }
    };
    return GrpcUtils.unaryToObservable(this.client.getNetworkEvents.bind(this.client), request, {});
  }

  getBopEvents(
    currentEvents: boolean,
    searchWindow: DateTimeRange | null,
    lastLoaded: Date | null,
    orderDescending: boolean
  ): Observable<gprc.GetBopEventsResponse> {
    const tmpRelativeFromNow = Duration.create();
    tmpRelativeFromNow.seconds = '' + 5 * 365 * 12 * 3600;

    const request: gprc.GetBopEventsRequest = {
      currentEvents,
      dateTimeFilter: {
        // TMP comment:

        // either searchWindow or relativeFromNow must be set, but not both
        // in searchWindow pass Utc datetimes

        // It could be handy to create DateTimeFilter class and pass all related props together,
        // in a similar way like Backend utilizes it (see Rfts400.Application.DateTimeFilter)

        // Looks like this DateTimeFilter will be reused for all reporting pages
        // All the hints from backend's DateTimeFilter class (about inclusive, exclusive)
        // also make sense to duplicate here, in the frontend side.

        searchWindow: searchWindow ? searchWindow : undefined,
        relativeFromNow: searchWindow ? undefined : tmpRelativeFromNow, // tmp set to make filtering work
        loadSince: lastLoaded ? Timestamp.fromDate(lastLoaded) : undefined,
        orderDescending: orderDescending
      }
    };
    return GrpcUtils.unaryToObservable(this.client.getBopEvents.bind(this.client), request, {});
  }

  getRtuAccidents(
    currentAccidents: boolean,
    searchWindow: DateTimeRange | null,
    lastLoaded: Date | null,
    orderDescending: boolean
  ): Observable<gprc.GetRtuAccidentsResponse> {
    const tmpRelativeFromNow = Duration.create();
    tmpRelativeFromNow.seconds = '' + 5 * 365 * 12 * 3600;

    const request: gprc.GetRtuAccidentsRequest = {
      currentAccidents,
      dateTimeFilter: {
        // TMP comment:

        // either searchWindow or relativeFromNow must be set, but not both
        // in searchWindow pass Utc datetimes

        // It could be handy to create DateTimeFilter class and pass all related props together,
        // in a similar way like Backend utilizes it (see Rfts400.Application.DateTimeFilter)

        // Looks like this DateTimeFilter will be reused for all reporting pages
        // All the hints from backend's DateTimeFilter class (about inclusive, exclusive)
        // also make sense to duplicate here, in the frontend side.

        searchWindow: searchWindow ? searchWindow : undefined,
        relativeFromNow: searchWindow ? undefined : tmpRelativeFromNow, // tmp set to make filtering work
        loadSince: lastLoaded ? Timestamp.fromDate(lastLoaded) : undefined,
        orderDescending: orderDescending
      }
    };
    return GrpcUtils.unaryToObservable(this.client.getRtuAccidents.bind(this.client), request, {});
  }

  getHasCurrent(): Observable<gprc.GetHasCurrentResponse> {
    const request: gprc.GetHasCurrentRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getHasCurrent.bind(this.client), request, {});
  }
}
