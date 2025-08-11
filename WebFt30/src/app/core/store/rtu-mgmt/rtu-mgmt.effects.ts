import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RtuMgmtService } from '../../grpc/services/rtu-mgmt.service';
import { RtuMgmtActions } from './rtu-mgmt.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { CoreUtils } from '../../core.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';

@Injectable()
export class RtuMgmtEffects {
  testMainChannel = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.testMainChannel),
      switchMap(({ netAddress }) => {
        return this.rtuMgmtService.testRtuConnection(netAddress).pipe(
          map((response) => {
            return RtuMgmtActions.testMainChannelSuccess({
              netAddress: response.netAddress,
              isConnectionSuccessful: response.isConnectionSuccessful
            });
          }),
          catchError((error) => {
            return of(RtuMgmtActions.testMainChannelFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  testReserveChannel = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.testReserveChannel),
      switchMap(({ netAddress }) => {
        return this.rtuMgmtService.testRtuConnection(netAddress).pipe(
          map((response) => {
            return RtuMgmtActions.testReserveChannelSuccess({
              netAddress: response.netAddress,
              isConnectionSuccessful: response.isConnectionSuccessful
            });
          }),
          catchError((error) => {
            return of(RtuMgmtActions.testReserveChannelFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  initializeRtu = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.initializeRtu),
      switchMap(({ dto }) => {
        return this.rtuMgmtService.initializeRtu(dto).pipe(
          map((response) => {
            return RtuMgmtActions.initializeRtuSuccess({
              dto: response.dto
            });
          }),
          catchError((error) => {
            return of(RtuMgmtActions.initializeRtuFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  startMeasurementClient = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.startMeasurementClient),
      switchMap(({ dto }) => {
        return this.rtuMgmtService.startMeasurementClient(dto).pipe(
          map((response) => {
            return RtuMgmtActions.startMeasurementClientSuccess();
          }),
          catchError((error) => {
            const serverError = GrpcUtils.toServerError(error);
            console.log(serverError);
            const errorMessageId =
              CoreUtils.serverErrorToMessageId(serverError) ?? 'i18n.ft.unknown-error';
            return of(RtuMgmtActions.startMeasurementClientFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  startPreciseMeasurementOutOfTurn = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.startPreciseMeasurementOutOfTurn),
      switchMap(({ dto }) => {
        return this.rtuMgmtService.startPreciseMeasurementOutOfTurn(dto).pipe(
          map((response) => {
            return RtuMgmtActions.startPreciseMeasurementOutOfTurnSuccess();
          }),
          catchError((error) => {
            const serverError = GrpcUtils.toServerError(error);
            const errorMessageId =
              CoreUtils.serverErrorToMessageId(serverError) ?? 'i18n.ft.unknown-error';
            return of(RtuMgmtActions.startPreciseMeasurementOutOfTurnFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  applyMonitoringSettings = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.applyMonitoringSettings),
      switchMap(({ dto }) => {
        return this.rtuMgmtService.applyMonitoringSettings(dto).pipe(
          map((response) => {
            return RtuMgmtActions.applyMonitoringSettingsSuccess({ dto: response.dto });
          }),
          catchError((error) => {
            const serverError = GrpcUtils.toServerError(error);
            const errorMessageId =
              CoreUtils.serverErrorToMessageId(serverError) ?? 'i18n.ft.unknown-error';
            return of(RtuMgmtActions.applyMonitoringSettingsFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  stopMonitoring = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.stopMonitoring),
      switchMap(({ rtuId }) => {
        return this.rtuMgmtService.stopMonitoring(rtuId).pipe(
          map((response) => {
            return RtuMgmtActions.stopMonitoringSuccess();
          }),
          catchError((error) => {
            return of(RtuMgmtActions.stopMonitoringFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  interruptMeasurement = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.interruptMeasurement),
      switchMap(({ rtuId }) => {
        return this.rtuMgmtService.interruptMeasurement(rtuId).pipe(
          map((response) => {
            return RtuMgmtActions.interruptMeasurementSuccess();
          }),
          catchError((error) => {
            return of(RtuMgmtActions.interruptMeasurementFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );
  constructor(private actions$: Actions, private rtuMgmtService: RtuMgmtService) {}
}
