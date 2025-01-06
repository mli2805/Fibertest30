import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AppState, AuthSelectors, RtuTreeActions, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { RtuTreeService } from 'src/app/core/grpc';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Trace } from 'src/app/core/store/models/ft30/trace';

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
  private _trace!: Trace;
  @Input() set trace(value: Trace) {
    this._trace = value;
    this.lineContent = `N${this._trace.port!.opticalPort}: ${this._trace.title}`;
  }
  get trace() {
    return this._trace;
  }
  @Input() isRtuAvailableNow!: boolean;
  @Input() isMonitoringOn!: boolean;

  public open = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private rtuTreeService: RtuTreeService
  ) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  onTraceNameClicked() {
    if (this.open === false) {
      this.open = true;
    }
    return false; // prevent browser menu
  }

  onOverlayClick(event: MouseEvent) {
    event.stopPropagation();
    this.open = false;
  }

  @HostListener('document:click', ['$event']) // левая кнопка
  @HostListener('document:contextmenu', ['$event']) // правая кнопка
  onClickEverywhere(event: MouseEvent) {
    // this means Outside overlay
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }

  onInformationClicked() {
    const path = `rtus/trace-information/${this.trace.traceId}`;
    this.router.navigate([path]);
  }

  onShowClicked() {
    //
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

    const path = `op-evnts/optical-events/${this.lastMeasurementId}`;
    this.router.navigate([path]);
  }

  onStatisticsClicked() {
    const path = `rtus/trace-statistics/${this.trace.traceId}`;
    this.router.navigate([path]);
  }

  onLandmarksClicked() {
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

  onAssignBaseRefsClicked() {
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

  onMeasurementClientClicked() {
    let portName!: string;
    if (this.trace.port!.isPortOnMainCharon) {
      portName = `${this.trace.port!.opticalPort}`;
    } else {
      portName = `${this.trace.port!.mainCharonPort}-${this.trace.port!.opticalPort}`;
    }
    this.router.navigate([`rtus/measurement-client/`, this._trace.rtuId, portName]);
  }
}
