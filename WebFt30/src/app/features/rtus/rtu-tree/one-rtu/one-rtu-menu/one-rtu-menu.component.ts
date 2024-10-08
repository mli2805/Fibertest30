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
    return false; // prevent browser menu
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

  canAutomaticBaseRefs() {
    return this.hasPermission(ApplicationPermission.AssignBaseRef) && this.rtu.isRtuAvailable;
  }

  onAutomaticBaseRefsClicked() {
    //
  }

  canMonitoringSettings(): boolean {
    return (
      this.hasPermission(ApplicationPermission.ChangeMonitoringSettings) && this.rtu.isRtuAvailable
    );
  }

  onMonitoringSettingsClicked() {
    const path = `rtus/monitoring-settings/${this.rtu.rtuId}`;
    this.router.navigate([path]);
  }

  canManualMode() {
    return (
      this.hasPermission(ApplicationPermission.ChangeMonitoringSettings) && this.rtu.isRtuAvailable
    );
  }

  onManualModeClicked() {
    this.store.dispatch(RtuMgmtActions.stopMonitoring({ rtuId: this.rtu.rtuId }));
  }

  canAutomaticMode() {
    return (
      this.hasPermission(ApplicationPermission.ChangeMonitoringSettings) && this.rtu.isRtuAvailable
    );
  }

  onAutomaticModeClicked() {
    //
  }

  canDetachAllTraces() {
    return this.hasPermission(ApplicationPermission.DetachTrace) && this.rtu.isRtuAvailable;
  }

  onDetachAllTracesClicked() {
    //
  }

  canRemove() {
    return this.hasPermission(ApplicationPermission.RemoveRtu);
  }

  onRemoveClicked() {
    //
  }

  canDefineTrace() {
    return this.hasPermission(ApplicationPermission.DefineTrace);
  }

  onDefineTraceClicked() {
    //
  }
}
