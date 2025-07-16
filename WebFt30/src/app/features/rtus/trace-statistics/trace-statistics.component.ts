import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { RtuTreeService } from 'src/app/core/grpc';
import { BaselineStat } from './baseline-stat';
import { MeasurementStat } from './measurement-stat';
import { TreeMapping } from 'src/app/core/store/mapping/tree-mapping';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { AppState, NavigationService, RtuTreeSelectors } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ExtensionUtils } from 'src/app/core/extension.utils';
import { Store } from '@ngrx/store';
import { RtuDateTimePipe } from 'src/app/shared/pipes/datetime.pipe';
import { BaseRefTypePipe } from 'src/app/shared/pipes/base-ref-type.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'rtu-trace-statistics',
  templateUrl: './trace-statistics.component.html',
  styleUrls: ['./trace-statistics.component.scss']
})
export class TraceStatisticsComponent implements OnInit {
  traceId!: string;
  rtu!: Rtu;
  trace!: Trace;
  port!: string;

  baselines!: BaselineStat[];
  measurements!: MeasurementStat[];

  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);

  public store: Store<AppState> = inject(Store);
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rtuTreeService: RtuTreeService,
    private ts: TranslateService,
    private dtPipe: RtuDateTimePipe,
    private baseRefPipe: BaseRefTypePipe,
    private navigationService: NavigationService
  ) {}

  async ngOnInit() {
    this.traceId = this.route.snapshot.paramMap.get('id')!;
    this.trace = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectTrace(this.traceId))!;
    this.rtu = CoreUtils.getCurrentState(this.store, RtuTreeSelectors.selectRtu(this.trace.rtuId))!;
    this.port = ExtensionUtils.PortOfOtauToString(this.trace.port);
    await this.load();
  }

  async load() {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    try {
      const response = await firstValueFrom(
        this.rtuTreeService.getTraceBaselineState(this.traceId)
      );
      this.baselines = response.baselines.map((b) => TreeMapping.toBaselineStat(b));
    } catch (error) {
      this.errorMessageId$.next('i18n.ft.cant-load-trace-baseline-stat');
      this.loading$.next(false);
      return;
    }

    try {
      const response = await firstValueFrom(this.rtuTreeService.getTraceStatistics(this.traceId));
      this.measurements = response.measurements.map((b) => TreeMapping.toMeasurementStat(b));
    } catch (error) {
      this.errorMessageId$.next('i18n.ft.cant-load-trace-measurement-stat');
      this.loading$.next(false);
      return;
    }

    this.loading$.next(false);
  }

  onBaselineClick(line: BaselineStat) {
    const dt = this.dtPipe.getDateTimeForFileName(line.assignedAt);
    const br = this.ts.instant(this.baseRefPipe.transform(line.baseRefType));
    const filename = `${this.trace.title} - ${br} - ${dt}.sor`;
    this.navigationService.baselineFileName = filename;
    this.router.navigate(['rtus/baseline', line.sorFileId]);
  }
}
