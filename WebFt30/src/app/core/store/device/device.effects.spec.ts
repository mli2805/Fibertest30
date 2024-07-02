import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { LocalStorageService } from '../../local-storage/local-storage.service';
import { PlatformService } from '../../grpc';
import { TestUtils } from 'src/app/test/test.utils';
import { GlobalUiActions } from '../../store/global-ui/global-ui.actions';
import { DeviceEffects } from './device.effects';
import { DeviceActions } from './device.actions';
import { CoreService } from '../../grpc/services/core.service';

describe('DeviceEffects', () => {
  let actions$: Actions;
  let effects: DeviceEffects;

  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let router: jasmine.SpyObj<Router>;
  let coreService: jasmine.SpyObj<CoreService>;

  beforeEach(() => {
    localStorageService = jasmine.createSpyObj('LocalStorageService', ['setAuth', 'removeAuth']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    coreService = jasmine.createSpyObj('CoreService', ['getDeviceInfo']);

    TestBed.configureTestingModule({
      providers: [
        DeviceEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: CoreService, useValue: coreService },
        { provide: Router, useValue: router },
        { provide: LocalStorageService, useValue: localStorageService }
      ]
    });

    effects = TestBed.inject(DeviceEffects);
  });

  describe('loadDeviceInfo', () => {
    it('should dispatch loadDeviceInfoSuccess action', () => {
      coreService.getDeviceInfo.and.returnValue(of(TestUtils.ValidDeviceInfoResponse));

      actions$ = of(DeviceActions.loadDeviceInfo());
      const spy = subscribeSpyTo(effects.loadDeviceInfo);

      expect(spy.getLastValue()).toEqual(
        DeviceActions.loadDeviceInfoSuccess({ deviceInfo: TestUtils.ValidDeviceInfo })
      );
    });

    it('should dispatch loadDeviceInfoFailure when throw error', () => {
      coreService.getDeviceInfo.and.returnValue(throwError(() => 'MyError'));

      actions$ = of(DeviceActions.loadDeviceInfo());
      const spy = subscribeSpyTo(effects.loadDeviceInfo);

      expect(spy.getLastValue()).toEqual(
        DeviceActions.loadDeviceInfoFailure({
          error: 'MyError'
        })
      );
    });
  });

  describe('loadDeviceInfoFailure', () => {
    it('should dispatch GlobalUiActions.showError', () => {
      actions$ = of(DeviceActions.loadDeviceInfoFailure({ error: 'MyError' }));

      const spy = subscribeSpyTo(effects.loadDeviceInfoFailure);

      expect(spy.getLastValue()).toEqual(
        GlobalUiActions.showError({
          error: 'MyError'
        })
      );
    });

    it('should dispatch GlobalUiActions.showError', () => {
      actions$ = of(DeviceActions.loadDeviceInfoFailure({ error: 'MyError' }));

      const spy = subscribeSpyTo(effects.loadDeviceInfoFailure);

      expect(spy.getLastValue()).toEqual(
        GlobalUiActions.showError({
          error: 'MyError'
        })
      );
    });
  });
});
