import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { IdentityService } from '../../grpc';
import { MapUtils } from '../../map.utils';
import { RolesActions } from './roles.actions';

@Injectable()
export class RolesEffects {
  getRoles = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.getRoles),
      switchMap(() =>
        this.identityService.getAllRoles().pipe(
          map((response) => {
            return RolesActions.getRolesSuccess({
              roles: MapUtils.toRoles(response.roles)
            });
          }),
          catchError((error) =>
            of(RolesActions.getRolesFailure({ errorMessageId: 'i18n.ft.cant-load-roles' }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private identityService: IdentityService) {}
}
