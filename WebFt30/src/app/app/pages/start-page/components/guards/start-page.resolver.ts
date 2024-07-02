import { Injectable } from '@angular/core';
import { firstValueFrom, take } from 'rxjs';
import { CurrentUserResolver } from './current-user.resolver';
import { AppState, GlobalUiActions, LocalStorageService, WindowRefService } from 'src/app/core';
import { IdentityService } from 'src/app/core/grpc';
import { GrpcUtils } from 'src/app/core/grpc/grpc.utils';
import { ServerError } from 'src/app/core/models/server-error';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class StartPageResolver {
  constructor(
    private identityService: IdentityService,
    private store: Store<AppState>,
    private windowRef: WindowRefService,
    private localStorage: LocalStorageService,
    private currentUserResolver: CurrentUserResolver
  ) {}

  async resolve(): Promise<any> {
    const isAuthenticated = await this.isAuthenticatedOnServer();
    if (!isAuthenticated) {
      // as we are here (canActivateStartPage says we are authenticated), the token looks valid, but either:
      // server invalidated it somehow (currently there is no such logic on the server)
      // or this is another server (if you connect from your debug environment to another server)
      // or server recreated the users or the whole database (demo server can recreates the database)
      // or maybe user was deleted from the server
      this.windowRef.removeAuthAndReload();
      return;
    }

    // load other resolvers manually, so they are called after authentication is checked
    await firstValueFrom(this.currentUserResolver.resolve());
  }

  private async isAuthenticatedOnServer(): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.identityService.isAuthenticated());
      return response.isAuthenticated;
    } catch (error) {
      const serverError = GrpcUtils.toServerError(error);
      if (GrpcUtils.isNoConnection(serverError)) {
        // of no connection, let's remove auth and reload the page to see login page
        return false;
      }

      let throwError = error;

      if (GrpcUtils.isInternalServerError(serverError)) {
        // When token's "Not valid before" field is in the future, the server currently returns 500 Internal Server Error
        // in this case let's remove saved auth, so user can see the error once and try to login again
        // Not valid before" can be in future, is someone changes the server time back.
        this.localStorage.removeAuth();
        throwError = 'Authentification failed. Please login again.';
      }

      // application expects to load few thing during startup,
      // but we interrupt the flow with the exception
      // so reset the loading
      this.store.dispatch(GlobalUiActions.resetLoading());
      throw throwError;
    }
  }
}
