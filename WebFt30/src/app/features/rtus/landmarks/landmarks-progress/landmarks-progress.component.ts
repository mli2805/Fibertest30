import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { AppState, LandmarksModelsSelectors } from 'src/app/core';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import {
  LandmarksUpdateProgress,
  LandmarksUpdateProgressedData
} from 'src/app/shared/system-events/system-event-data/landmarks-update';

export class LandmarksUpdateLine {
  message!: string;
  isProblem!: boolean;
}

@Component({
  selector: 'rtu-landmarks-progress',
  templateUrl: './landmarks-progress.component.html'
})
export class LandmarksProgressComponent {
  public dialogRef: DialogRef<ReturnCode> = inject(DialogRef<ReturnCode>);
  public store: Store<AppState> = inject(Store);

  private progressData$ = this.store.select(LandmarksModelsSelectors.selectProgress);
  progressLines$ = this.progressData$.pipe(map((data) => this.toLines(data)));
  finishLine$ = this.progressData$.pipe(map((data) => this.getFinishLine(data)));
  done$ = this.progressData$.pipe(map((data) => this.getDone(data)));

  constructor(private gisMapService: GisMapService, private ts: TranslateService) {}

  toLines(data: LandmarksUpdateProgressedData[]): LandmarksUpdateLine[] {
    const lines: LandmarksUpdateLine[] = [];
    data.forEach((d) => {
      const l = this.getMessage(d);
      lines.push(l);
      if (d.Step === LandmarksUpdateProgress.TraceBaseRefsProcessed) {
        const l2 = `${this.ts.instant('i18n.ft.traces-processed')}:  ${d.TraceNumber} / ${
          d.TraceCount
        }`;
        lines.push({ message: l2, isProblem: false });
      }
    });
    return lines;
  }

  getFinishLine(data: LandmarksUpdateProgressedData[]): LandmarksUpdateLine | null {
    if (data.length === 0 || data.at(-1)?.Step !== LandmarksUpdateProgress.AllDone) return null;
    if (data.length === 1)
      return {
        message: this.ts.instant('i18n.ft.failed-to-apply-landmark-changes'),
        isProblem: true
      };

    console.log(data);
    const problems = data.filter(
      (l) => l.Step === LandmarksUpdateProgress.TraceBaseRefsProcessed && !l.IsSuccess
    );
    if (problems.length === 0) {
      this.resultCode = ReturnCode.Ok;
      return { message: this.ts.instant('i18n.ft.success'), isProblem: false };
    }

    this.resultCode = ReturnCode.Error;
    return {
      message: `${this.ts.instant('i18n.ft.attention-problems-found')}  ${problems.length}`,
      isProblem: true
    };
  }

  resultCode!: ReturnCode;
  getDone(data: LandmarksUpdateProgressedData[]): boolean {
    if (data.length === 0) return false;
    if (data.length === 1 && data[0].ReturnCode === ReturnCode.FailedToApplyLandmarkChanges) {
      this.resultCode = ReturnCode.FailedToApplyLandmarkChanges;
      return true;
    }
    return data.at(-1)?.Step === LandmarksUpdateProgress.AllDone;
  }

  getMessage(data: LandmarksUpdateProgressedData): LandmarksUpdateLine {
    switch (data.Step) {
      case LandmarksUpdateProgress.CommandsPersistedInEventStorage:
        return this.returnCodeToMessage(data.ReturnCode);
      case LandmarksUpdateProgress.TraceBaseRefsProcessed: {
        const t = this.ts.instant('i18n.ft.trace');
        const tt = this.getTraceTitle(data.TraceId);
        const ml = this.returnCodeToMessage(data.ReturnCode);
        return { message: `${t} ${tt}: ${this.ts.instant(ml.message)}`, isProblem: ml.isProblem };
      }
    }

    return { message: '', isProblem: false };
  }

  returnCodeToMessage(code: ReturnCode): LandmarksUpdateLine {
    switch (code) {
      case ReturnCode.Ok:
        return { message: 'i18n.ft.success', isProblem: false };

      case ReturnCode.LandmarkChangesAppliedSuccessfully:
        return { message: 'i18n.ft.landmark-changes-applied-successfully', isProblem: false };
      case ReturnCode.FailedToApplyLandmarkChanges:
        return { message: 'i18n.ft.failed-to-apply-landmark-changes', isProblem: true };
      case ReturnCode.FailedToGetBaseRefs:
        return { message: 'i18n.ft.failed-to-get-base-ref', isProblem: true };
      case ReturnCode.BaseRefsForTraceModifiedSuccessfully:
        return { message: 'i18n.ft.base-refs-for-trace-modified-successfully', isProblem: false };
      case ReturnCode.FailedToModifyBaseRef:
        return { message: 'i18n.ft.failed-to-modify-base-ref', isProblem: true };
      case ReturnCode.BaseRefsSavedSuccessfully:
        return { message: 'i18n.ft.base-refs-saved-successfully', isProblem: false };
      case ReturnCode.FailedToSaveBaseRefs:
        return { message: 'i18n.ft.failed-to-save-base-ref', isProblem: true };
      case ReturnCode.BaseRefsForTraceSentSuccessfully:
        return { message: 'i18n.ft.base-refs-sent-successfully', isProblem: false };
      case ReturnCode.FailedToSendBaseToRtu:
        return { message: 'i18n.ft.failed-to-send-base-ref', isProblem: true };
    }
    return { message: 'i18n.ft.unknown-code', isProblem: true };
  }

  getTraceTitle(traceId: string) {
    const trace = this.gisMapService.getGeoData().traces.find((t) => t.id === traceId);
    return trace?.title ?? '';
  }

  onCloseClicked() {
    this.dialogRef.close(this.resultCode);
  }
}
