import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

import { AuthInterceptor } from '../auth.interceptor';
import { GrpcUtils } from '../grpc.utils';
import * as grpc from 'src/grpc-generated';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private authInterceptor = inject(AuthInterceptor);
  private client: grpc.IdentityClient;

  constructor() {
    const interceptors = [this.authInterceptor.toRpcInterceptor()];
    const options = GrpcUtils.getGrpcOptions(GrpcUtils.getApiUrl(), interceptors);
    const transport = new GrpcWebFetchTransport(options);
    this.client = new grpc.IdentityClient(transport);
  }

  login(userName: string, password: string): Observable<grpc.LoginResponse> {
    const request: grpc.LoginRequest = { userName, password };
    return GrpcUtils.unaryToObservable(this.client.login.bind(this.client), request, {});
  }

  refreshToken(): Observable<grpc.RefreshTokenResponse> {
    const request: grpc.RefreshTokenRequest = {};
    return GrpcUtils.unaryToObservable(this.client.refreshToken.bind(this.client), request, {});
  }

  isAuthenticated(): Observable<grpc.IsAuthenticatedResponse> {
    const request: grpc.IsAuthenticatedRequest = {};
    return GrpcUtils.unaryToObservable(this.client.isAuthenticated.bind(this.client), request, {});
  }

  getCurrentUser(): Observable<grpc.GetCurrentUserResponse> {
    const request: grpc.GetCurrentUserRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getCurrentUser.bind(this.client), request, {});
  }

  saveUserSettings(userSettings: grpc.UserSettings): Observable<grpc.SaveUserSettingsResponse> {
    const request: grpc.SaveUserSettingsRequest = {
      settings: userSettings
    };
    return GrpcUtils.unaryToObservable(this.client.saveUserSettings.bind(this.client), request, {});
  }

  getAllRoles(): Observable<grpc.GetAllRolesResponse> {
    const request: grpc.GetAllRolesRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getAllRoles.bind(this.client), request, {});
  }

  getAllUsers(): Observable<grpc.GetAllUsersResponse> {
    const request: grpc.GetAllUsersRequest = {};
    return GrpcUtils.unaryToObservable(this.client.getAllUsers.bind(this.client), request, {});
  }

  getUser(userId: string): Observable<grpc.GetUserResponse> {
    const request: grpc.GetUserRequest = { userId };
    return GrpcUtils.unaryToObservable(this.client.getUser.bind(this.client), request, {});
  }

  createUser(patch: grpc.ApplicationUserPatch): Observable<grpc.CreateUserResponse> {
    const request: grpc.CreateUserRequest = { patch };
    return GrpcUtils.unaryToObservable(this.client.createUser.bind(this.client), request, {});
  }

  updateUser(
    userId: string,
    patch: grpc.ApplicationUserPatch
  ): Observable<grpc.UpdateUserResponse> {
    const request: grpc.UpdateUserRequest = {
      userId,
      patch
    };
    return GrpcUtils.unaryToObservable(this.client.updateUser.bind(this.client), request, {});
  }

  deleteUser(userId: string): Observable<grpc.DeleteUserResponse> {
    const request: grpc.DeleteUserRequest = { userId };
    return GrpcUtils.unaryToObservable(this.client.deleteUser.bind(this.client), request, {});
  }
}
