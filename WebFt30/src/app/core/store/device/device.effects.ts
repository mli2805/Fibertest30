import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { catchError, map, switchMap, tap, finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as moment from 'moment-timezone';

import { DeviceActions } from './device.actions';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { MapUtils } from '../../map.utils';
import { AppState } from '../../core.state';
import { CoreService } from '../../grpc/services/core.service';

@Injectable()
export class DeviceEffects {
  loadDeviceInfo = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.loadDeviceInfo),
      // tap(() => this.store.dispatch(GlobalUiActions.showLoading())),
      switchMap(() =>
        this.coreService.getDeviceInfo().pipe(
          map((grpcDeviceInfo) => {
            const deviceInfo = MapUtils.toDeviceInfo(grpcDeviceInfo);

            return DeviceActions.loadDeviceInfoSuccess({
              deviceInfo
            });
          }),
          catchError((error) => of(DeviceActions.loadDeviceInfoFailure({ error }))),
          finalize(() => this.store.dispatch(GlobalUiActions.hideLoading()))
        )
      )
    )
  );

  loadDeviceInfoFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.loadDeviceInfoFailure),
      map(({ error }) => GlobalUiActions.showError({ error }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private coreService: CoreService
  ) {}
}
