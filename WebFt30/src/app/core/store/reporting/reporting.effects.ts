import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ReportsService } from '../../grpc/services/reporting.service';
import { ReportingActions } from './reporting.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { ReportingMapping } from '../mapping/reporting-mapping';
import { CoreUtils } from '../../core.utils';
import { GrpcUtils } from '../../grpc/grpc.utils';
import { GlobalUiActions } from '../global-ui/global-ui.actions';
import { FileSaverService } from '../../services';

@Injectable()
export class ReportingEffects {
  getUserActionLines = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.getUserActionLines),
      switchMap(({ userId, searchWindow, operationCodes }) =>
        this.reportsService.getUserActionLines(userId, searchWindow, operationCodes).pipe(
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

  getUserActionsPdf = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.getUserActionsPdf),
      switchMap(({ userId, searchWindow, operationCodes }) =>
        this.reportsService.getUserActionsPdf(userId, searchWindow, operationCodes).pipe(
          map(({ pdf }) => ReportingActions.getUserActionsPdfSuccess({ pdf })),
          catchError((error) => {
            console.log(error);
            const errorId = CoreUtils.commonErrorToMessageId(
              GrpcUtils.toServerError(error),
              'i18n.logs.cant-get-user-actions-pdf'
            );
            return of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: errorId!
              })
            );
          })
        )
      )
    )
  );

  getUserActionsPdfSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReportingActions.getUserActionsPdfSuccess),
        map(({ pdf }) => {
          const name = 'user-actions.pdf';
          this.fileSaver.saveAs(pdf, name);
        })
      ),
    { dispatch: false }
  );

  getOpticalEventsReportPdf = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.getOpticalEventsReportPdf),
      switchMap(
        ({ isCurrentEvents, searchWindow, eventStatuses, traceStates, isDetailed, isShowPlace }) =>
          this.reportsService
            .getOpticalEventsReportPdf(
              isCurrentEvents,
              searchWindow,
              eventStatuses,
              traceStates,
              isDetailed,
              isShowPlace
            )
            .pipe(
              map(({ pdf }) => ReportingActions.getOpticalEventsReportPdfSuccess({ pdf })),
              catchError((error) => {
                console.log(error);
                const errorId = CoreUtils.commonErrorToMessageId(
                  GrpcUtils.toServerError(error),
                  'i18n.logs.cant-get-optical-events-report-pdf'
                );
                return of(
                  GlobalUiActions.showPopupError({
                    popupErrorMessageId: errorId!
                  })
                );
              })
            )
      )
    )
  );

  getOpticalEventsReportPdfSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReportingActions.getOpticalEventsReportPdfSuccess),
        map(({ pdf }) => {
          const name = 'optical-events.pdf';
          this.fileSaver.saveAs(pdf, name);
        })
      ),
    { dispatch: false }
  );

  getMonitoringSystemReportPdf = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.getMonitoringSystemReportPdf),
      switchMap(() =>
        this.reportsService.getMonitoringSystemReportPdf().pipe(
          map(({ pdf }) => ReportingActions.getMonitoringSystemReportPdfSuccess({ pdf })),
          catchError((error) => {
            console.log(error);
            const errorId = CoreUtils.commonErrorToMessageId(
              GrpcUtils.toServerError(error),
              'i18n.logs.cant-get-monitoring-system-report-pdf'
            );
            return of(
              GlobalUiActions.showPopupError({
                popupErrorMessageId: errorId!
              })
            );
          })
        )
      )
    )
  );

  getMonitoringSystemReportPdfSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReportingActions.getMonitoringSystemReportPdfSuccess),
        map(({ pdf }) => {
          const name = 'monitoring-system.pdf';
          this.fileSaver.saveAs(pdf, name);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private reportsService: ReportsService,
    private fileSaver: FileSaverService
  ) {}
}
