import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RtuTreeService } from '../../grpc/services/rtu-tree.service';
import { RtuTreeActions } from './rtu-tree.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { TreeMapping } from '../mapping/tree-mapping';
import { Rtu } from 'src/grpc-generated';

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
                errorMessageId: ''
              })
            );
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private rtuTreeService: RtuTreeService) {}
}
