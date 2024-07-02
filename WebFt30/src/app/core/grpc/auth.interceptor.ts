import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  RpcOptions,
  RpcInterceptor,
  NextUnaryFn,
  NextServerStreamingFn,
  MethodInfo,
  UnaryCall,
  ServerStreamingCall
} from '@protobuf-ts/runtime-rpc';

import { AuthSelectors } from '../auth/auth.selectors';
import { AppState } from '../core.state';
import { CoreUtils } from '../core.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor {
  private store: Store<AppState> = inject(Store<AppState>);

  toRpcInterceptor(): RpcInterceptor {
    return {
      interceptUnary: this.unaryAddAuthTokenInterceptor.bind(this),
      interceptServerStreaming:
        this.streamAddAuthTokenInterceptorinterceptServerStreaming.bind(this)
    };
  }

  private unaryAddAuthTokenInterceptor(
    next: NextUnaryFn,
    method: MethodInfo,
    input: object,
    options: RpcOptions
  ): UnaryCall {
    options = this.addAuthorizationToken(options);
    // console.log('unary AUTH interceptor', options);
    return next(method, input, options);
  }

  private streamAddAuthTokenInterceptorinterceptServerStreaming(
    next: NextServerStreamingFn,
    method: MethodInfo,
    input: object,
    options: RpcOptions
  ): ServerStreamingCall {
    options = this.addAuthorizationToken(options);
    // console.log('stream AUTH interceptor', options);
    return next(method, input, options);
  }

  private addAuthorizationToken(options: RpcOptions): RpcOptions {
    if (!options.meta) {
      options.meta = {};
    }

    const token = CoreUtils.getCurrentState(this.store, AuthSelectors.selectToken);
    if (!token) {
      // delete options.meta['Authorization'];
      const { ['Authorization']: _, ...rest } = options.meta;
      options.meta = rest;

      return options;
    } else {
      options.meta['Authorization'] = `Bearer ${token}`;
      return options;
    }
  }
}
