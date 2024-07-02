import { Observable, delay, from, map, of, switchMap, tap } from 'rxjs';
import { GrpcWebOptions } from '@protobuf-ts/grpcweb-transport';
import {
  RpcOptions,
  UnaryCall,
  ServerStreamingCall,
  FinishedUnaryCall,
  RpcInterceptor
} from '@protobuf-ts/runtime-rpc';

import { environment } from 'src/environments/environment';
import { ServerError } from '../models/server-error';

export class GrpcUtils {
  public static logGrpcExecutionTime = false; // set by AppSettingsService

  public static getApiUrl(): string {
    const api = <any>environment.api;
    const protocol = api.protocol || window.location.protocol.replace(':', '');
    const host = api.host || window.location.hostname;
    const port = api.port || window.location.port;

    if (port) {
      return `${protocol}://${host}:${port}`;
    } else {
      return `${protocol}://${host}`;
    }
  }

  public static getGrpcOptions(baseUrl: string, interceptors: RpcInterceptor[]): GrpcWebOptions {
    const options: GrpcWebOptions = {
      baseUrl: baseUrl,
      // timeout: 10000, // aware: should not be used for streaming call as it stops them as well
      format: 'binary', // let's use binary, streaming also works with it (how? why?)
      interceptors: interceptors,
      meta: {} // set global request headers here
    };

    return options;
  }

  public static unaryToObservable<TRequest extends object, TResponse extends object>(
    grpcCall: (request: TRequest, options: RpcOptions) => UnaryCall<TRequest, TResponse>,
    request: TRequest,
    options: RpcOptions
  ): Observable<TResponse> {
    // of(null).pipe(delay(1)) trick is used to allow caller to handle error using catchError
    // in case the error are thrown synchronously (before the observable is created)
    // This can happen for example if protobuf-ts throws an error during serialization
    return of(null).pipe(
      delay(1),
      switchMap(() => {
        const startTime = Date.now();
        return from(grpcCall(request, options)).pipe(
          tap(() => {
            if (GrpcUtils.logGrpcExecutionTime == true) {
              const endTime = Date.now();
              console.log(
                `[grpc] ${grpcCall.name.replace('bound ', '')} took ${endTime - startTime}ms`
              );
            }
          })
        );
      }),
      map((call: FinishedUnaryCall<TRequest, TResponse>) => call.response)
    );
  }

  public static streamToObservable<TRequest extends object, TResponse extends object>(
    grpcCall: (request: TRequest, options: RpcOptions) => ServerStreamingCall<TRequest, TResponse>,
    request: TRequest,
    options: RpcOptions
  ): Observable<TResponse> {
    return of(null).pipe(
      delay(1),
      switchMap(() => from(grpcCall(request, options).responses))
    );

    // return from(grpcCall(request, options).responses);
  }

  public static toServerError(rpcError: any): ServerError {
    return new ServerError(rpcError.code, rpcError.message);
  }

  public static isNoConnection(error: ServerError): boolean {
    return error.code == 'INTERNAL' && error.message == 'Failed to fetch';
  }

  public static isInternalServerError(error: ServerError): boolean {
    return error.code == 'UNKNOWN' && error.message == 'Internal Server Error';
  }

  public static getCommonServerErrorMessageId(error: ServerError): string | null {
    if (GrpcUtils.isNoConnection(error)) {
      return 'i18n.common.grpc.error.cant-connect-to-the-server';
    }

    return null;
  }
}
