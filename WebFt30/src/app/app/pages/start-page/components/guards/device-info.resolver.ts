import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, race, take } from 'rxjs';

import { AppState, DeviceActions } from 'src/app/core';
import { DeviceSelectors } from 'src/app/core/store/device/device.selectors';
import { CoreUtils } from 'src/app/core/core.utils';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({ providedIn: 'root' })
export class DeviceInfoResolver {
  constructor(private store: Store<AppState>, private actions$: Actions, private router: Router) {}

  resolve(): Observable<any> {
    const deviceInfo = CoreUtils.getCurrentState(this.store, DeviceSelectors.selectInfo);
    if (deviceInfo) {
      return of(null);
    }

    return CoreUtils.dispatchAndWaitObservable(
      this.store,
      this.actions$,
      DeviceActions.loadDeviceInfo(),
      DeviceActions.loadDeviceInfoSuccess,
      DeviceActions.loadDeviceInfoFailure
    );
  }
}
