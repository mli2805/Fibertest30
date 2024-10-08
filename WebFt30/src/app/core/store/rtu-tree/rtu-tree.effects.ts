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
            console.log(response.rtus);
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
            console.log(rtu);
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

  constructor(private actions$: Actions, private rtuTreeService: RtuTreeService) {}
}
