import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { SorResultBaselineComponent } from '../../fiberizer-core/components/viewer-providers';
import { SorTrace } from '@veex/sor';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FileSaverService } from 'src/app/core';
import { RtuMgmtService } from 'src/app/core/grpc';
import { ConvertUtils } from 'src/app/core/convert.utils';

@Component({
  selector: 'rtu-baseline-view',
  templateUrl: './baseline-view.component.html',
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaselineViewComponent implements OnInit {
  @ViewChild(SorResultBaselineComponent) resultBaselineComponent!: SorResultBaselineComponent;

  baseRefSorId!: number;

  loading$ = new BehaviorSubject<boolean>(false);
  errorMessageId$ = new BehaviorSubject<string | null>(null);

  baselineTrace: SorTrace | null = null;
  sorFile: Uint8Array | null = null;

  constructor(
    private route: ActivatedRoute,
    private rtuMgmtService: RtuMgmtService,
    private fileSaverService: FileSaverService
  ) {}

  async ngOnInit() {
    this.baseRefSorId = +this.route.snapshot.paramMap.get('id')!;
    await this.load();
  }

  async load() {
    this.errorMessageId$.next(null);
    this.loading$.next(true);

    try {
      const response = await firstValueFrom(
        // если это сорка базовой, то данный запрос возвращает её в поле measurement
        // а поле baseline останется пустым
        this.rtuMgmtService.getMeasurementSor(this.baseRefSorId)
      );

      this.baselineTrace = await ConvertUtils.buildSorTrace(response.measurement);
      this.sorFile = response.file;

      this.loading$.next(false);
    } catch (error) {
      this.errorMessageId$.next('i18n.ft.cant-load-measurement-sor-file');
      this.loading$.next(false);
      return;
    }
  }

  async saveSor() {
    if (!this.sorFile) {
      return;
    }

    this.fileSaverService.saveAs(this.sorFile!, 'base.sor');
  }
}
