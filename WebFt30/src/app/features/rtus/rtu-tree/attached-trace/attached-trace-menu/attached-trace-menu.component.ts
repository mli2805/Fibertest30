import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AppState, AuthSelectors, RtuTreeActions, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { RtuTreeService } from 'src/app/core/grpc';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'rtu-attached-trace-menu',
  templateUrl: './attached-trace-menu.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ]
})
export class AttachedTraceMenuComponent {
  store: Store<AppState> = inject(Store<AppState>);
  currentUser: User | null;

  lineContent!: string;
  portName!: string;
  traceTitle!: string;
  private _trace!: Trace;
  @Input() set trace(value: Trace) {
    this._trace = value;
    this.lineContent = `N${this._trace.port!.opticalPort}: ${this._trace.title}`;
    this.portName = `N${this._trace.port!.opticalPort}`;
    this.traceTitle = this._trace.title;
  }
  get trace() {
    return this._trace;
  }
  @Input() isRtuAvailableNow!: boolean;
  @Input() isMonitoringOn!: boolean;
  @Input() rtu!: Rtu;

  public open = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private rtuTreeService: RtuTreeService,
    private gisMapService: GisMapService
  ) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  overlayX = 0;
  overlayY = 0;

  // left & right mouse button
  onTraceNameClicked(event: MouseEvent) {
    if (this.open === false) {
      this.open = true;
    }
    // event.offsetX - смещение от каждого элементика внутри полосы - квадратика, строки
    this.overlayX = event.clientX - 184; // поэтому приходится брать clientX
    this.overlayY = event.offsetY - 10;

    return false; // prevent browser menu
  }

  onOverlayClick(event: MouseEvent) {
    event.stopPropagation();
    this.open = false;
  }

  // @HostListener('document:click', ['$event']) // левая кнопка
  // @HostListener('document:contextmenu', ['$event']) // правая кнопка
  // onClickEverywhere(event: MouseEvent) {
  //   // this means Outside overlay
  //   if (!this.elementRef.nativeElement.contains(event.target)) {
  //     this.open = false;
  //   }
  // }

  // когда мышка покидает саму полоску и оверлей с меню - закрывает меню
  mouseOver = 0;

  async onMouseLeave() {
    this.mouseOver = this.mouseOver - 1;
    await Utils.delay(200);

    if (this.mouseOver < 0) {
      this.mouseOver = 0;
      this.open = false;
    }
  }

  onMouseEnter() {
    this.mouseOver = this.mouseOver + 1;
  }
  ////////////////

  async onInformationClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/trace-information/${this.trace.traceId}`;
    this.router.navigate([path]);
  }

  onShowClicked() {
    const externalCmd = { name: 'ShowTrace', traceId: this.trace.traceId };
    this.gisMapService.externalCommand.next(externalCmd);
  }

  lastMeasurementId!: number;
  async onStateClicked() {
    try {
      const response = await firstValueFrom(
        this.rtuTreeService.getTraceLastMeasurement(this._trace.traceId)
      );
      this.lastMeasurementId = response.sorFileId;
    } catch (error) {
      return;
    }

    this.open = false;
    await Utils.delay(100);

    const path = `op-evnts/optical-events/${this.lastMeasurementId}`;
    this.router.navigate([path]);
  }

  async onStatisticsClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/trace-statistics/${this.trace.traceId}`;
    this.router.navigate([path]);
  }

  async onLandmarksClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/trace-landmarks/${this.trace.traceId}`;
    this.router.navigate([path]);
  }

  canDetachTrace() {
    return (
      this.hasPermission(ApplicationPermission.DetachTrace) &&
      (!this.isMonitoringOn || !this.trace.isIncludedInMonitoringCycle)
    );
  }

  onDetachTraceClicked() {
    this.store.dispatch(RtuTreeActions.detachTrace({ traceId: this._trace.traceId }));
  }

  canAssignBaseRefs() {
    return (
      this.hasPermission(ApplicationPermission.AssignBaseRef) &&
      this.isRtuAvailableNow &&
      (!this.isMonitoringOn || !this.trace.isIncludedInMonitoringCycle)
    );
  }

  async onAssignBaseRefsClicked() {
    this.open = false;
    await Utils.delay(100);

    this.router.navigate([`rtus/assign-base/`, this._trace.rtuId, this._trace.traceId]);
  }

  canAutomaticBaseRefs() {
    return (
      this.hasPermission(ApplicationPermission.AssignBaseRef) &&
      this.isRtuAvailableNow &&
      (!this.isMonitoringOn || !this.trace.isIncludedInMonitoringCycle)
    );
  }

  onAutomaticBaseRefsClicked() {
    //
  }

  canPreciseOutOfTurn() {
    return (
      this.hasPermission(ApplicationPermission.DoPreciseMonitoringOutOfOrder) &&
      this.trace.hasEnoughBaseRefsToPerformMonitoring &&
      this.isRtuAvailableNow
    );
  }

  onPreciseOutOfTurnClicked() {
    //
  }

  canMeasurementClient() {
    return this.hasPermission(ApplicationPermission.DoMeasurementClient) && this.isRtuAvailableNow;
  }

  async onMeasurementClientClicked() {
    let portName!: string;
    if (this.trace.port!.isPortOnMainCharon) {
      portName = `${this.trace.port!.opticalPort}`;
    } else {
      portName = `${this.trace.port!.mainCharonPort}-${this.trace.port!.opticalPort}`;
    }

    this.open = false;
    await Utils.delay(100);

    this.router.navigate([`rtus/measurement-client/`, this._trace.rtuId, portName]);
  }
}
