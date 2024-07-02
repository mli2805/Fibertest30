import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { IdentityService } from '../grpc';
import { AuthEffects } from './auth.effects';
import { AuthActions } from './auth.actions';
import { LoginResponse } from 'src/grpc-generated/identity';
import { TestUtils } from 'src/app/test/test.utils';
import { AuthUtils } from './auth.utils';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GlobalUiActions } from '../store/global-ui/global-ui.actions';
import { MapUtils } from '../map.utils';
import { WindowRefService } from '../services';
import { ServerError } from '../models/server-error';

describe('AuthEffects', () => {
  let actions$: Actions;
  let effects: AuthEffects;

  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let router: jasmine.SpyObj<Router>;
  let windowRef: jasmine.SpyObj<WindowRefService>;
  let identityService: jasmine.SpyObj<IdentityService>;
  let store: MockStore;
  let dispatchSpy: any;

  const allowLoginResponse: LoginResponse = {
    allow: true,
    token: TestUtils.ValidToken,
    user: TestUtils.ValidUser,
    settings: TestUtils.ValidUserSettings
  };

  const refectLoginResponse: LoginResponse = {
    allow: false,
    token: '',
    user: undefined
  };

  beforeEach(() => {
    localStorageService = jasmine.createSpyObj('LocalStorageService', ['setAuth', 'removeAuth']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    windowRef = jasmine.createSpyObj('WindowRefService', ['reload', 'removeAuthAndReload']);
    identityService = jasmine.createSpyObj('IdentityService', [
      'login',
      'refreshToken',
      'getCurrentUser'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: IdentityService, useValue: identityService },
        { provide: Router, useValue: router },
        { provide: WindowRefService, useValue: windowRef },
        { provide: LocalStorageService, useValue: localStorageService }
      ]
    });

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    effects = TestBed.inject(AuthEffects);
  });

  describe('login', () => {
    it('should dispatch loginSuccess when login is successful and allowed', () => {
      identityService.login.and.returnValue(of(allowLoginResponse));

      actions$ = of(AuthActions.login({ username: 'user', password: 'password' }));
      const spy = subscribeSpyTo(effects.login);

      expect(spy.getLastValue()).toEqual(
        AuthActions.loginSuccess({
          token: allowLoginResponse.token,
          user: MapUtils.toUser(allowLoginResponse.user!),
          settings: MapUtils.toUserSettings(allowLoginResponse.settings)
        })
      );
    });

    it('should dispatch loginFailure when login is not allowed', () => {
      identityService.login.and.returnValue(of(refectLoginResponse));

      actions$ = of(AuthActions.login({ username: 'user', password: 'password' }));
      const spy = subscribeSpyTo(effects.login);

      expect(spy.getLastValue()).toEqual(
        AuthActions.loginFailure({
          error: 'i18n.error.invalid-username-or-password'
        })
      );
    });

    it('should dispatch loginFailure when throw error', () => {
      const serverError = new ServerError('MyError', 'MyMessage');
      identityService.login.and.returnValue(throwError(() => serverError));

      actions$ = of(AuthActions.login({ username: 'user', password: 'password' }));
      const spy = subscribeSpyTo(effects.login);

      expect(spy.getLastValue()).toEqual(
        AuthActions.loginFailure({
          error: serverError
        })
      );
    });
  });

  describe('loginSuccess', () => {
    it('loginSuccess should not dispatch any action', () => {
      actions$ = EMPTY;
      const metadata = getEffectsMetadata(effects);
      expect(metadata.loginSuccess?.dispatch).toEqual(false);
    });

    it('loginSuccess should setAuth', () => {
      actions$ = of(
        AuthActions.loginSuccess({
          token: 'token',
          user: <any>{ permissions: [] },
          settings: null
        })
      );
      effects.loginSuccess.subscribe(() => {
        expect(localStorageService.setAuth).toHaveBeenCalledWith('token');
      });
    });

    it('loginSuccess should navigate to root', () => {
      actions$ = of(
        AuthActions.loginSuccess({
          token: 'token',
          user: <any>{ permissions: [] },
          settings: null
        })
      );
      effects.loginSuccess.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('logout', () => {
    it('logout should not dispatch any action', () => {
      actions$ = EMPTY;
      const metadata = getEffectsMetadata(effects);
      expect(metadata.logout?.dispatch).toEqual(false);
    });
    // it('logout should remoteAuth', () => {
    //   actions$ = of(AuthActions.logout());
    //   effects.logout.subscribe(() => {
    //     expect(localStorageService.removeAuth).toHaveBeenCalled();
    //   });
    // });
    it('logout should reload the page to reset ngrx state', () => {
      actions$ = of(AuthActions.logout());
      effects.logout.subscribe(() => {
        expect(windowRef.removeAuthAndReload).toHaveBeenCalled();
      });
    });
  });

  describe('refreshToken', () => {
    it('refreshToken should dispatch refreshTokenSuccess', () => {
      const newToken = 'newToken';
      identityService.refreshToken.and.returnValue(of({ token: newToken }));

      actions$ = of(AuthActions.refreshToken());
      const spy = subscribeSpyTo(effects.refreshToken);

      expect(spy.getLastValue()).toEqual(AuthActions.refreshTokenSuccess({ token: newToken }));
    });
  });

  describe('loadCurrentUser', () => {
    it('should dispatch loadCurrentUserSuccess when get the currentUser', () => {
      identityService.getCurrentUser.and.returnValue(
        of({ user: TestUtils.ValidUser, settings: TestUtils.ValidUserSettings })
      );

      actions$ = of(AuthActions.loadCurrentUser());
      const spy = subscribeSpyTo(effects.loadCurrentUser);

      expect(spy.getLastValue()).toEqual(
        AuthActions.loadCurrentUserSuccess({
          user: MapUtils.toUser(TestUtils.ValidUser),
          settings: MapUtils.toUserSettings(TestUtils.ValidUserSettings)
        })
      );
    });
    it('should dispatch loadCurrentUserFailure when throw error', () => {
      const serverError = new ServerError('MyError', 'MyMessage');
      identityService.getCurrentUser.and.returnValue(throwError(() => serverError));

      actions$ = of(AuthActions.loadCurrentUser());
      const spy = subscribeSpyTo(effects.loadCurrentUser);

      expect(spy.getLastValue()).toEqual(
        AuthActions.loadCurrentUserFailure({
          error: serverError
        })
      );
    });
    it('should dispatch GlobalUiActions.showInitialLoading', () => {
      identityService.getCurrentUser.and.returnValue(of({ user: TestUtils.ValidUser }));

      actions$ = of(AuthActions.loadCurrentUser());

      effects.loadCurrentUser.subscribe();

      expect(dispatchSpy).toHaveBeenCalledWith(GlobalUiActions.showInitialLoading());
      expect(dispatchSpy).toHaveBeenCalledWith(GlobalUiActions.hideLoading());
    });
  });

  describe('loadCurrentUserFailure', () => {
    it('should dispatch GlobalUiActions.showError', () => {
      actions$ = of(AuthActions.loadCurrentUserFailure({ error: 'MyError' }));

      const spy = subscribeSpyTo(effects.loadCurrentUserFailure);

      expect(spy.getLastValue()).toEqual(
        GlobalUiActions.showError({
          error: 'MyError'
        })
      );
    });
  });
});
