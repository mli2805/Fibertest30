import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SorColors, SorTrace } from '@veex/sor';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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

    try {
      const response = await firstValueFrom(
        this.rtuMgmtService.getMeasurementSor(this.opticalEventId)
      );
      this.measurementTrace = await ConvertUtils.buildSorTrace(response.measurement);
      this.baselineTrace = await ConvertUtils.buildSorTrace(response.baseline!, SorColors.Baseline);
      this.sorFile = response.file;

      this.loading$.next(false);
    } catch (error) {
      this.errorMessageId$.next('i18n.ft.cant-load-measurement-sor-file');
      this.loading$.next(false);
      return;
    }
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
    if (!this.opticalEvent || !this.sorFile) {
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
