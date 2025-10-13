import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { catchError, map, switchMap, tap, finalize, exhaustMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as moment from 'moment-timezone';

import { DeviceActions } from './device.actions';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { MapUtils } from '../../map.utils';
import { AppState } from '../../core.state';
import { CoreService } from '../../grpc/services/core.service';
import { EventTablesService } from '../../grpc/services/event-tables.service';
import { EventTablesMapping } from '../mapping/event-tables-mapping';
import { FtSettingsService } from '../../grpc';
import { FileSaverService } from '../../services/file-saver.service';

@Injectable()
export class DeviceEffects {
  loadDeviceInfo = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.loadDeviceInfo),
      // tap(() => this.store.dispatch(GlobalUiActions.showLoading())),
      switchMap(() =>
        this.coreService.getDeviceInfo().pipe(
          map((response) => {
            const deviceInfo = MapUtils.toDeviceInfo(response);
            const hasCurrentEvents = EventTablesMapping.fromGrpcHasCurrentEvents(
              response.hasCurrentEvents!
            );
            return DeviceActions.loadDeviceInfoSuccess({
              deviceInfo,
              hasCurrentEvents
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

  getHasCurrent = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.getHasCurrentEvents),
      switchMap(() =>
        this.eventTablesService.getHasCurrent().pipe(
          map((response) => {
            const hasCurrentEvents = EventTablesMapping.fromGrpcHasCurrentEvents(
              response.hasCurrentEvents!
            );
            return DeviceActions.getHasCurrentEventsSuccess({ hasCurrentEvents });
          }),
          catchError((error) => of(DeviceActions.getHasCurrentEventsFailure({ error })))
        )
      )
    )
  );

  getLogBundle = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceActions.getLogBundle),
      exhaustMap(() =>
        this.ftSettingsServcie.getLogBundle().pipe(
          map(({ archive }) => DeviceActions.getLogBundleSuccess({ archive })),
          catchError((error) =>
            of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: 'i18n.ft.cant-load-log-bundle'
              })
            )
          )
        )
      )
    )
  );

  getLogBundleSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DeviceActions.getLogBundleSuccess),
        map(({ archive }) => {
          const name = 'log-bundle.zip';
          this.fileSaver.saveAs(archive, name);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private coreService: CoreService,
    private eventTablesService: EventTablesService,
    private ftSettingsServcie: FtSettingsService,
    private fileSaver: FileSaverService
  ) {}
}
