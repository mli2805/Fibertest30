import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { ApplyMonitoringSettingsDto } from 'src/app/core/store/models/ft30/apply-monitorig-settings-dto';
import { FiberState, Frequency } from 'src/app/core/store/models/ft30/ft-enums';
import { PortWithTraceDto } from 'src/app/core/store/models/ft30/port-with-trace-dto';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';

@Component({
  selector: 'rtu-one-rtu-menu',
  templateUrl: './one-rtu-menu.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ]
})
export class OneRtuMenuComponent {
  store: Store<AppState> = inject(Store<AppState>);
  currentUser: User | null;

  @Input() rtu!: Rtu;
  @Input() children!: any[];

  public open = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  onRtuNameClicked() {
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

  canInitialize(): boolean {
    return this.hasPermission(ApplicationPermission.InitializeRtu);
  }

  onNetworkSettignsClicked() {
    const path = `rtus/initialization/${this.rtu.rtuId}`;
    this.router.navigate([path]);
  }

  onStateClicked() {
    //
  }

  onLandmarksClicked() {
    //
  }

  onAutomaticBaseRefsClicked() {
    //
  }

  onMonitoringSettingsClicked() {
    const dto = new ApplyMonitoringSettingsDto();
    dto.rtuId = this.rtu.rtuId;
    dto.rtuMaker = this.rtu.rtuMaker;
    dto.isMonitoringOn = true;

    dto.preciseMeas = Frequency.EveryHour;
    dto.preciseSave = Frequency.EveryDay;
    dto.fastSave = Frequency.DoNot;

    dto.ports = [];
    const trace = this.rtu.traces[0];
    const port1 = new PortWithTraceDto();
    port1.traceId = trace.traceId;
    port1.portOfOtau = trace.port!;
    port1.lastTraceState = FiberState.Unknown;
    port1.lastRtuAccidentOnTrace = ReturnCode.MeasurementEndedNormally;
    dto.ports.push(port1);

    this.store.dispatch(RtuMgmtActions.applyMonitoringSettings({ dto }));
  }

  onManualModeClicked() {
    this.store.dispatch(RtuMgmtActions.stopMonitoring({ rtuId: this.rtu.rtuId }));
  }

  onClicked() {
    //
  }
}
