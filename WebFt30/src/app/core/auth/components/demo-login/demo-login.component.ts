import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, AuthState, AuthActions, AuthSelectors, LocalStorageService } from 'src/app/core';

@Component({
  selector: 'rtu-demo-login',
  templateUrl: 'demo-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoLoginComponent implements OnInit {
  private store: Store<AppState> = inject(Store<AppState>);
  private localStorageService: LocalStorageService = inject(LocalStorageService);

  auth$: Observable<AuthState> | undefined;
  isAuthenticated$: Observable<boolean> | undefined;

  ngOnInit() {
    this.auth$ = this.store.select(AuthSelectors.selectAuth);
    this.isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  }

  onLogoutClick() {
    this.store.dispatch(AuthActions.logout());
  }

  onRefreshTokenClick() {
    this.store.dispatch(AuthActions.refreshToken());
  }

  copyToClipboard(text: string | null) {
    navigator.clipboard.writeText(text || '');
  }

  // async loginKeycloak() {
  //   this.token = await this.getKeycloakAccessToken(
  //     'http://192.168.96.24:8080',
  //     'master',
  //     'rfts-400-api',
  //     'VawB2hE37zz9qpVL8YejFL6rpml5gyah'
  //   );
  // }

  // async getKeycloakAccessToken(
  //   keycloakUrl: string,
  //   realm: string,
  //   clientId: string,
  //   clientSecret: string
  // ): Promise<string | null> {
  //   const tokenEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;

  //   const requestBody = new URLSearchParams();
  //   requestBody.append('grant_type', 'client_credentials');
  //   requestBody.append('client_id', clientId);
  //   requestBody.append('client_secret', clientSecret);

  //   try {
  //     const response = await fetch(tokenEndpoint, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //       body: requestBody.toString()
  //     });

  //     if (!response.ok) {
  //       console.error(`Error fetching access token: ${response.statusText}`);
  //       return null;
  //     }

  //     const data = await response.json();
  //     return data.access_token;
  //   } catch (error) {
  //     console.error(`Error fetching access token: ${error}`);
  //     return null;
  //   }
  // }
}
