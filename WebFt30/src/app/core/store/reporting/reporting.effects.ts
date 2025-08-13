import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ReportsService } from '../../grpc/services/reporting.service';
import { ReportingActions } from './reporting.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { ReportingMapping } from '../mapping/reporting-mapping';

@Injectable()
export class ReportingEffects {
  getUserActionLines = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.getUserActionLines),
      switchMap(() =>
        this.reportsService.getUserActionLines().pipe(
          map((response) => {
            return ReportingActions.getUserActionLinesSuccess({
              lines: response.lines.map((l) => ReportingMapping.fromGrpsUserActionLine(l))
            });
          }),
          catchError((error) => of(ReportingActions.getUserActionLinesFailure({ error })))
        )
      )
    )
  );
  constructor(private actions$: Actions, private reportsService: ReportsService) {}
}
