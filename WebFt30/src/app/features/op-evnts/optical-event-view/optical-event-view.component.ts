import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SorColors, SorTrace } from '@veex/sor';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  forkJoin,
  mergeMap,
  of,
  takeUntil,
  tap
} from 'rxjs';
import { AppState, RtuTreeSelectors } from 'src/app/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { EventTablesService, RtuMgmtService } from 'src/app/core/grpc';
import { BaseRefType } from 'src/app/core/store/models/ft30/ft-enums';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { SorResultBaselineComponent } from '../../fiberizer-core/components/viewer-providers';
import { EventTablesMapping } from 'src/app/core/store/mapping/event-tables-mapping';
import { FileSaverService } from 'src/app/core/grpc/services/file-saver.service';
import { RtuDateTimePipe } from 'src/app/shared/pipes/datetime.pipe';

@Component({
  selector: 'rtu-optical-event-view',
  templateUrl: './optical-event-view.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpticalEventViewComponent extends OnDestroyBase implements OnInit {
  @ViewChild(SorResultBaselineComponent) resultBaselineComponent!: SorResultBaselineComponent;

  opticalEventId!: number;
  opticalEvent!: OpticalEvent | null;
  baseRefSorId!: number;

  fullScreen = false;
  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);

  measurementTrace: SorTrace | null = null;
  baselineTrace: SorTrace | null = null;
  sorFile: Uint8Array | null = null;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private eventTableService: EventTablesService,
    private rtuMgmtService: RtuMgmtService,
    private fileSaverService: FileSaverService,
    private dtPipe: RtuDateTimePipe
  ) {
    super();
  }

  async ngOnInit() {
    this.opticalEventId = +this.route.snapshot.paramMap.get('id')!;
    await this.load();
  }

  async load() {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    try {
      const response = await firstValueFrom(
        this.eventTableService.getOpticalEvent(this.opticalEventId)
      );
      this.opticalEvent = EventTablesMapping.toOpticalEvent(response.opticalEvent!);

      this.baseRefSorId = this.getBaseRefSorId(this.opticalEvent!);
    } catch (error) {
      this.errorMessageId$.next('i18n.ft.cant-load-optical-event');
      this.loading$.next(false);
      return;
    }

    forkJoin({
      measurementSor: this.rtuMgmtService.getMeasurementSor(this.opticalEventId, 0, true).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.ft.cant-load-measurement-sor-file');
          return of(null);
        })
      ),
      baselineSor: this.rtuMgmtService.getMeasurementSor(this.opticalEventId, 1, true).pipe(
        mergeMap(async ({ sor }) => ConvertUtils.buildSorTrace(sor, SorColors.Baseline)),
        catchError((error) => {
          this.errorMessageId$.next('i18n.ft.cant-load-baseline-sor-file');
          return of(null);
        })
      )
    })
      .pipe(
        takeUntil(this.ngDestroyed$),
        tap(() => this.loading$.next(false)),
        tap(({ measurementSor, baselineSor }) => {
          this.measurementTrace = measurementSor;
          this.baselineTrace = baselineSor;
        })
      )
      .subscribe();
  }

  getBaseRefSorId(opticalEvent: OpticalEvent): number {
    const trace = CoreUtils.getCurrentState(
      this.store,
      RtuTreeSelectors.selectTrace(opticalEvent.traceId)
    );

    return opticalEvent.baseRefType === BaseRefType.Precise
      ? trace!.preciseSorId
      : this.opticalEvent!.baseRefType === BaseRefType.Fast
      ? trace!.fastSorId
      : trace!.additionalSorId;
  }

  async saveSor() {
    if (!this.opticalEvent) {
      return;
    }

    try {
      const response = await firstValueFrom(
        this.rtuMgmtService.getMeasurementSor(this.opticalEventId, 2, false)
      );
      this.sorFile = response.sor;
      console.log(this.sorFile);
    } catch (error) {
      this.errorMessageId$.next('i18n.ft.cant-load-file');
      this.loading$.next(false);
      return;
    }

    const dt = this.dtPipe.getDateTimeForFileName(this.opticalEvent.registeredAt);
    const filename = `${this.opticalEvent.traceTitle} - ID${this.opticalEventId} - ${dt}.sor`;

    this.fileSaverService.saveAs(this.sorFile!, filename);
  }

  toggleFullScreen() {
    this.fullScreen = !this.fullScreen;
  }
}
