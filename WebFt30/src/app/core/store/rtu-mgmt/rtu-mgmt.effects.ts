import { Injectable } from '@angular/core';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { RtuMgmtService } from '../../grpc/services/rtu-mgmt.service';
import { RtuMgmtActions } from './rtu-mgmt.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { CoreUtils } from '../../core.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';

@Injectable()
export class RtuMgmtEffects {
  testRtuConnection = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuMgmtActions.testRtuConnection),
      switchMap(({ netAddress }) => {
        return this.rtuMgmtService.testRtuConnection(netAddress).pipe(
          map((response) => {
            return RtuMgmtActions.testRtuConnectionSuccess({
              netAddress: response.netAddress,
              isConnectionSuccessful: response.isConnectionSuccessful
            });
          }),
          catchError((error) => {
            return of(RtuMgmtActions.testRtuConnectionFailure({ errorMessageId: error }));
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
            console.log(response);
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
            const errorMessageId =
              CoreUtils.serverErrorToMessageId(serverError) ?? 'i18n.error.unknown-error';
            return of(RtuMgmtActions.startMeasurementClientFailure({ errorMessageId }));
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private rtuMgmtService: RtuMgmtService) {}
}
