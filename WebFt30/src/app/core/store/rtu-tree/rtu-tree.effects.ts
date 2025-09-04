import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RtuTreeService } from '../../grpc/services/rtu-tree.service';
import { RtuTreeActions } from './rtu-tree.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { TreeMapping } from '../mapping/tree-mapping';

@Injectable()
export class RtuTreeEffects {
  refreshRtuTree = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuTreeActions.refreshRtuTree),
      switchMap(() => {
        return this.rtuTreeService.refreshRtuTree().pipe(
          map((response) => {
            const rtus = response.rtus.map((r) => TreeMapping.fromGrpcRtu(r));
            return RtuTreeActions.refreshRtuTreeSuccess({ rtus });
          }),
          catchError((error) => {
            return of(
              RtuTreeActions.refreshRtuTreeFailure({
                errorMessageId: 'i18n.ft.cant-load-rtu-tree'
              })
            );
          })
        );
      })
    )
  );

  getOneRtu = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuTreeActions.getOneRtu),
      switchMap(({ rtuId }) => {
        return this.rtuTreeService.getOneRtu(rtuId).pipe(
          map((response) => {
            const rtu = TreeMapping.fromGrpcRtu(response.rtu!);
            return RtuTreeActions.getOneRtuSuccess({ rtu });
          }),
          catchError((error) => {
            return of(
              RtuTreeActions.getOneRtuFailure({
                errorMessageId: 'i18n.ft.cant-load-rtu'
              })
            );
          })
        );
      })
    )
  );

  attachTrace = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuTreeActions.attachTrace),
      switchMap(({ dto }) => {
        return this.rtuTreeService.attachTrace(dto).pipe(
          map((response) => {
            return RtuTreeActions.attachTraceSuccess();
          }),
          catchError((error) => {
            return of(RtuTreeActions.attachTraceFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  detachTrace = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuTreeActions.detachTrace),
      switchMap(({ traceId }) => {
        return this.rtuTreeService.detachTrace(traceId).pipe(
          map((response) => {
            return RtuTreeActions.detachTraceSuccess();
          }),
          catchError((error) => {
            return of(RtuTreeActions.detachTraceFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  detachAllTraces = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuTreeActions.detachAllTraces),
      switchMap(({ rtuId }) => {
        return this.rtuTreeService.detachAllTraces(rtuId).pipe(
          map((response) => {
            return RtuTreeActions.detachAllTracesSuccess();
          }),
          catchError((error) => {
            return of(RtuTreeActions.detachAllTracesFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  attachOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuTreeActions.attachOtau),
      switchMap(({ dto }) => {
        return this.rtuTreeService.attachOtau(dto).pipe(
          map((response) => {
            return RtuTreeActions.attachOtauSuccess();
          }),
          catchError((error) => {
            return of(RtuTreeActions.attachOtauFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  detachOtau = createEffect(() =>
    this.actions$.pipe(
      ofType(RtuTreeActions.detachOtau),
      switchMap(({ dto }) => {
        return this.rtuTreeService.detachOtau(dto).pipe(
          map((response) => {
            return RtuTreeActions.detachOtauSuccess();
          }),
          catchError((error) => {
            return of(RtuTreeActions.detachOtauFailure({ errorMessageId: error }));
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private rtuTreeService: RtuTreeService) {}
}
