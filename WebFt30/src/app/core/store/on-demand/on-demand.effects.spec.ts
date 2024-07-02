import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { LocalStorageService } from '../../local-storage/local-storage.service';
import { MeasurementService } from '../../grpc';
import { TestUtils } from 'src/app/test/test.utils';
import { GlobalUiActions } from '../../store/global-ui/global-ui.actions';
import { OnDemandEffects } from './on-demand.effects';
import { OnDemandActions } from './on-demand.actions';

import { GrpcUtils } from '../../grpc/grpc.utils';
import { MapUtils } from '../../map.utils';

describe('OnDemandEffects', () => {
  let actions$: Actions;
  let effects: OnDemandEffects;

  let dispatchSpy: any;
  let store: MockStore;
  let measurementService: jasmine.SpyObj<MeasurementService>;

  beforeEach(() => {
    measurementService = jasmine.createSpyObj('MeasurementService', [
      'getUserOnDemand',
      'startOnDemand',
      'stopOnDemand',
      'getOnDemandProgress'
    ]);

    TestBed.configureTestingModule({
      providers: [
        OnDemandEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: MeasurementService, useValue: measurementService }
      ]
    });

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    effects = TestBed.inject(OnDemandEffects);
  });

  describe('startOnDemand', () => {
    it('should not dispatch startOnDemandSuccess action', () => {
      measurementService.startOnDemand.and.returnValue(of({ onDemandId: 'some-on-demand-id' }));

      actions$ = of(
        OnDemandActions.startOnDemand({
          monitoringPortId: TestUtils.MonitoringPortId,
          measurementSettings: TestUtils.MeasurementSettings
        })
      );
      const spy = subscribeSpyTo(effects.startOnDemand);

      expect(spy.getLastValue()).toEqual(
        GlobalUiActions.dummyAction()
        // OnDemandActions.startOnDemandSuccess({ onDemandId: 'some-on-demand-id' })
      );
    });

    it('should dispatch startOnDemandFailure when throw error', () => {
      measurementService.startOnDemand.and.returnValue(throwError(() => TestUtils.MyServerError));

      actions$ = of(
        OnDemandActions.startOnDemand({
          monitoringPortId: TestUtils.MonitoringPortId,
          measurementSettings: TestUtils.MeasurementSettings
        })
      );
      const spy = subscribeSpyTo(effects.startOnDemand);

      expect(spy.getLastValue()).toEqual(
        OnDemandActions.startOnDemandFailure({
          error: GrpcUtils.toServerError(TestUtils.MyServerError)
        })
      );
    });
  });

  describe('stopOnDemand', () => {
    it('should dispatch stopOnDemandSuccess action', () => {
      measurementService.stopOnDemand.and.returnValue(of({ otdrTaskId: 'some-on-demand-id' }));

      actions$ = of(OnDemandActions.stopOnDemand({ otdrTaskId: 'some-on-demand-id' }));
      const spy = subscribeSpyTo(effects.stopOnDemand);

      expect(spy.getLastValue()).toEqual(OnDemandActions.stopOnDemandSuccess());
    });

    it('should dispatch stopOnDemandFailure when throw error', () => {
      measurementService.stopOnDemand.and.returnValue(throwError(() => TestUtils.MyServerError));

      actions$ = of(OnDemandActions.stopOnDemand({ otdrTaskId: 'some-on-demand-id' }));
      const spy = subscribeSpyTo(effects.stopOnDemand);

      expect(spy.getLastValue()).toEqual(
        OnDemandActions.stopOnDemandFailure({
          error: GrpcUtils.toServerError(TestUtils.MyServerError)
        })
      );
    });
  });
});
