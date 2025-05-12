import { ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartDataService, ChartMatrixesService } from '@veex/chart';
import {
  EventTableService,
  KeyEvent,
  KeySegment,
  SorAreaViewerService,
  SorColors,
  SorData,
  SorTrace,
  SorViewerService
} from '@veex/sor';
import { LinkMapViewerService, LinkMapAreaSettings, LinkMapBase } from '@veex/link-map';
import { takeUntil } from 'rxjs';
import { AppState, SettingsSelectors } from 'src/app/core';
import { SorUtils } from '../sor-utils';
import { OnDestroyBase } from 'src/app/shared/components/on-destroy-base/on-destroy-base';
import { VX_DIALOG_SERVICE } from '@veex/common';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'rtu-sor-area-provider',
  template: `<vx-sor-area *ngIf="service.isLoaded()"></vx-sor-area>`,
  providers: [
    SorViewerService,
    SorAreaViewerService,
    EventTableService,
    ChartDataService,
    ChartMatrixesService,
    { provide: VX_DIALOG_SERVICE, useExisting: DialogService }
    // { provide: VX_DIALOG_SERVICE, useExisting: MessageBoxService }
  ]
})
export class SorAreaProviderComponent extends OnDestroyBase {
  @Input() set sors(value: SorTrace[]) {
    this.service.reset();

    value = value.filter((sor) => sor.sorData !== null);

    if (value) {
      this.service.set(value);
    }
  }

  @Input() set enableFilter(value: boolean) {
    this.service.settings.showFilterSwitch = value;
    this.service.setSettings(this.service.settings);
  }

  constructor(public service: SorAreaViewerService, private store: Store<AppState>) {
    super();

    this.store
      .select(SettingsSelectors.selectTheme)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((theme: string) => {
        this.service.updateIsDarkTheme(theme === 'dark');
      });

    service.settings.higlightSpan = false;
    service.showLandmarksDock = true;
    service.isEditMode = true;
    service.sorViewer.showTracesOffset = true;

    service.sorViewer.traceOffsetMode = 'noiseFloor';
    service.sorViewer.setTracesOffset(0);

    service.sorViewer.chartMargin = 10;
  }
}

@Component({
  selector: 'rtu-sor-viewer-realtime-provider',
  template: `<vx-sor-area *ngIf="service.isLoaded()"></vx-sor-area>`,
  providers: [
    SorViewerService,
    SorAreaViewerService,
    EventTableService,
    ChartDataService,
    ChartMatrixesService
  ]
})
export class SorViewerRealtimeProviderComponent extends OnDestroyBase {
  @Input() set sor(value: SorTrace) {
    const previousMarkerContext = {
      viewPort: this.chartMx.viewPort,
      lsa: this.eventTable.lsaEnabled,
      isTwoMarkers: this.eventTable.isTwoMarkersActive,
      isFiveMarkers: this.eventTable.isFiveMarkersActive,
      twoMarkers: this.eventTable.twoMarkers.getMarkersFromScreenOwt(),
      fiveMarkers: this.eventTable.fiveMarkers.getMarkersFromScreenOwt()
    };

    this.service.reset();

    if (value) {
      this.service.set([value]);
      this.loadFromPrevious(value.sorData, previousMarkerContext);
      SorUtils.setTraceOffset([value], this.service.sorViewer);
    }
  }

  loadFromPrevious(sor: SorData, ctx: any) {
    if (ctx.isTwoMarkers) {
      const segment = KeySegment.fromMarkers(ctx.twoMarkers, ctx.lsa, sor);
      this.eventTable.twoMarkers.loadSegment(segment, ctx.lsa);
      this.eventTable.activeMarkers = this.eventTable.twoMarkers;
    }

    if (ctx.isFiveMarkers) {
      const event = KeyEvent.fromMarkers(ctx.fiveMarkers, ctx.lsa, sor);
      this.eventTable.fiveMarkers.loadEvent(event, ctx.lsa);
      this.eventTable.activeMarkers = this.eventTable.fiveMarkers;
    }

    this.chartMx.viewPort = ctx.viewPort;
  }

  constructor(
    public service: SorAreaViewerService,
    private eventTable: EventTableService,
    private chartMx: ChartMatrixesService,
    private store: Store<AppState>
  ) {
    super();

    this.store
      .select(SettingsSelectors.selectTheme)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((theme: string) => {
        this.service.updateIsDarkTheme(theme === 'dark');
      });

    service.settings.higlightSpan = false;
    service.settings.showFilterSwitch = false;
    service.settings.showDock = false;
    service.sorViewer.showTracesOffset = false;
    service.sorViewer.showZoomPanel = false;
    service.sorViewer.enableVerticalOffset = false;
    service.showEventsDock = false;
    service.showLandmarksDock = true;
    service.showPropertiesDock = false;
    service.showAnalysisDock = false;
    service.showSummaryDock = false;
  }
}

@Component({
  selector: 'rtu-sor-result-baseline-provider',
  templateUrl: `sor-result-baseline-provider.component.html`,
  styles: [':host { width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SorResultBaselineComponent extends OnDestroyBase {
  @ViewChild(SorAreaProviderComponent) sorArea!: SorAreaProviderComponent;
  sorColors = SorColors;

  @Input() result!: SorTrace | null;
  @Input() baseline!: SorTrace;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  get activeTrace() {
    return this.sorArea?.service.sorViewer.activeTrace;
  }

  clickBaseline() {
    this.sorArea.service.sorViewer.setActiveTrace(this.baseline!);
    this.cdr.markForCheck();
  }

  clickMeasurement() {
    this.sorArea.service.sorViewer.setActiveTrace(this.result!);
    this.cdr.markForCheck();
  }

  selectEventByKeyEventIndex(keyEventIndex: number) {
    const keyEvent = this.sorArea.service.eventTable.eventsProvider.keyEvents.find(
      (x) => x.keyEventIndex == keyEventIndex
    );

    if (keyEvent) {
      this.sorArea.service.eventTable.setSelectedEventOrSegment(keyEvent, true);
    }
  }
}

@Component({
  selector: 'rtu-link-map-area-provider',
  template: `<vx-link-map-area *ngIf="service.isLoaded()"></vx-link-map-area>`,
  styles: [':host { width: 100%; height: 100%; }'],
  providers: [LinkMapViewerService]
})
export class LinkMapAreaProviderComponent {
  @Input() set vscout(value: LinkMapBase) {
    if (!value) {
      this.service.reset();
    } else {
      this.service.set(value);
    }
  }

  constructor(public service: LinkMapViewerService) {
    const settings = LinkMapAreaSettings.Default();
    settings.showDock = true;
    service.setSettings(settings);
    service.showPassFail = false;
  }
}
