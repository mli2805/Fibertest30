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
import { FileSaverService } from 'src/app/core/services/file-saver.service';
import { RtuDateTimePipe } from 'src/app/shared/pipes/datetime.pipe';
import { RftsEventsService } from 'src/app/core/grpc/services/rfts-events.service';
import { RftsEventsMapping } from 'src/app/core/store/mapping/rfts-events-mapping';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';

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
  opticalEvent$ = new BehaviorSubject<OpticalEvent | null>(null);

  fullScreen = false;
  isGraphMode = true;
  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);

  measurementTrace: SorTrace | null = null;
  baselineTrace: SorTrace | null = null;
  sorFile: Uint8Array | null = null;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private windowService: WindowService,
    private eventTableService: EventTablesService,
    private rtuMgmtService: RtuMgmtService,
    private rftsEventsService: RftsEventsService,
    private fileSaverService: FileSaverService,
    private dtPipe: RtuDateTimePipe
  ) {
    super();
  }

  async ngOnInit() {
    this.opticalEventId = +this.route.snapshot.paramMap.get('id')!;
    const open = this.route.snapshot.queryParamMap.get('open') ?? 'map';
    this.isGraphMode = open === 'map';
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
      this.opticalEvent$.next(this.opticalEvent);

      this.baseRefSorId = this.getBaseRefSorId(this.opticalEvent!);
    } catch (error) {
      this.errorMessageId$.next('i18n.ft.cant-load-optical-event');
      this.loading$.next(false);
      return;
    }

    try {
      const response = await firstValueFrom(
        // этот запрос берет сорку измерения со встроенной базовой (так мы храним в бд)
        // на сервере разделяет ее на 3 набора байт:
        // весь исходный файл, [ измерение и базовая - это не полные сорки, а только new MeasurementTrace(sorBytes).OtdrData.ToSorDataBuf() ]
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

  toggleGraphSor() {
    this.isGraphMode = !this.isGraphMode;
  }

  async showRftsEvents() {
    const response = await firstValueFrom(
      this.rftsEventsService.getRftsEvents(this.opticalEvent!.eventId)
    );
    const rftsEvents = RftsEventsMapping.fromRftsEventsDto(response.rftsEventsData!);
    this.windowService.registerWindow(crypto.randomUUID(), 'RftsEvents', rftsEvents);
  }
}
