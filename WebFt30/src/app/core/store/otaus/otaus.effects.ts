import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { MapUtils } from '../../map.utils';
import { CoreService } from '../../grpc/services/core.service';
import { OtausActions } from './otaus.actions';
import { GlobalUiActions } from '../global-ui/global-ui.actions';

@Injectable()
export class OtausEffects {
  constructor(private actions$: Actions, private coreService: CoreService) {}
}
