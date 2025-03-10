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
import { AppState, AuthSelectors, RtuTreeActions, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { RtuMgmtActions } from 'src/app/core/store/rtu-mgmt/rtu-mgmt.actions';
import { SecUtil } from '../../../rtu-monitoring-settings/sec-util';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { Utils } from 'src/app/shared/utils/utils';

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
    public gisMapService: GisMapService,
    private elementRef: ElementRef,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  // right mouse button
  onRtuNameClicked() {
    if (this.open === false) {
      this.open = true;
    }
    return false; // prevent browser menu
  }

  // этот обработчик нужен для тех пунктов, которые не переходят на новую страницу
  async onOverlayClick(event: MouseEvent) {
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

  async onInformationClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/information/${this.rtu.rtuId}`;
    this.router.navigate([path]);
  }

  onShowClicked() {
    const cmd = {
      name: 'ShowRtu',
      nodeId: this.rtu.nodeId
    };
    this.gisMapService.externalCommand.next(cmd);
  }

  async onNetworkSettingsClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/initialization/${this.rtu.rtuId}`;
    this.router.navigate([path]);
  }

  async onStateClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/state/${this.rtu.rtuId}`;
    this.router.navigate([path]);
  }

  async onLandmarksClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/landmarks/${this.rtu.rtuId}`;
    this.router.navigate([path]);
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

  async onMonitoringSettingsClicked() {
    this.open = false;
    await Utils.delay(100);

    this.store.dispatch(RtuMgmtActions.reset());
    const path = `rtus/monitoring-settings/${this.rtu.rtuId}`;
    this.router.navigate([path]);
  }

  canManualMode() {
    return (
      this.hasPermission(ApplicationPermission.ChangeMonitoringSettings) && this.rtu.isRtuAvailable
    );
  }

  onManualModeClicked() {
    this.store.dispatch(RtuMgmtActions.setSpinner({ value: true }));
    this.store.dispatch(RtuMgmtActions.stopMonitoring({ rtuId: this.rtu.rtuId }));
  }

  canAutomaticMode() {
    return (
      this.hasPermission(ApplicationPermission.ChangeMonitoringSettings) && this.rtu.isRtuAvailable
    );
  }

  onAutomaticModeClicked() {
    const dto = SecUtil.buildAutoModeDto(this.rtu);
    console.log(dto);
    this.store.dispatch(RtuMgmtActions.applyMonitoringSettings({ dto }));
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
