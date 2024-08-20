import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
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

  public open = false;

  constructor(private elementRef: ElementRef, private router: Router) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  onTraceNameClicked() {
    if (this.open === false) {
      this.open = true;
    }
  }

  onOverlayClick(event: MouseEvent) {
    event.stopPropagation();
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  onClickEverywhere(event: MouseEvent) {
    // this means Outside overlay
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }

  onInformationClicked() {
    //
  }

  onStateClicked() {
    //
  }

  onStatisticsClicked() {
    //
  }

  onLandmarksClicked() {
    //
  }

  onDetachTraceClicked() {
    //
  }
  onAssignBaseRefClicked() {
    //
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
