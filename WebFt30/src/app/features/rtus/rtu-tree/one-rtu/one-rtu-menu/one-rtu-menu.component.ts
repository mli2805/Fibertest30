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
import { SecUtil } from '../../../rtu-monitoring-settings/sec-util';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { Utils } from 'src/app/shared/utils/utils';
import { StepModel } from 'src/app/features/gis/forms/trace-define/step-model';
import { MapRtuMenu } from 'src/app/features/gis/components/gis-actions/map-rtu-menu';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { RtuInfoMode } from 'src/app/features/gis/forms/add-rtu-dialog/rtu-info/rtu-info.component';

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
    private windowService: WindowService,
    private elementRef: ElementRef,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  overlayX = 0;
  overlayY = 0;

  // left & right mouse button
  onRtuNameClicked(event: MouseEvent) {
    if (this.open === false) {
      this.open = true;
    }

    // event.offsetX - смещение от каждого элементика внутри полосы - квадратика, строки
    this.overlayX = event.clientX - 120; // поэтому приходится брать clientX
    this.overlayY = event.offsetY - 10;

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
    const node = this.gisMapService.getNode(this.rtu.nodeId);
    this.gisMapService.setRtuNodeForDialog(node, RtuInfoMode.ShowInformation);
  }

  onShowClicked() {
    const cmd = {
      name: 'ShowRtu',
      nodeId: this.rtu.nodeId
    };
    this.gisMapService.externalCommand.next(cmd);
  }

  async onNetworkSettingsClicked() {
    this.windowService.registerWindow(this.rtu.rtuId, 'NetworkSettings', this.rtu);
  }

  async onStateClicked() {
    this.windowService.registerWindow(this.rtu.rtuId, 'RtuState', this.rtu);
  }

  async onLandmarksClicked() {
    this.open = false;
    if (this.rtu.traces.length === 0) return;
    const firstTrace = this.rtu.traces[0];
    this.windowService.registerWindow(firstTrace.traceId, 'Landmarks', this.rtu);
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
      this.hasPermission(ApplicationPermission.ChangeMonitoringSettings) &&
      this.rtu.isRtuAvailable &&
      this.rtu.isMonitoringOn
    );
  }

  onManualModeClicked() {
    this.store.dispatch(RtuMgmtActions.setSpinner({ value: true }));
    this.store.dispatch(RtuMgmtActions.stopMonitoring({ rtuId: this.rtu.rtuId }));
  }

  canAutomaticMode() {
    return (
      this.hasPermission(ApplicationPermission.ChangeMonitoringSettings) &&
      this.rtu.isRtuAvailable &&
      !this.rtu.isMonitoringOn
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
    return MapRtuMenu.canRemoveRtu(this.rtu.nodeId);
  }

  onRemoveClicked() {
    MapRtuMenu.removeRtuInner(this.rtu.nodeId);
  }

  canDefineTrace() {
    return this.hasPermission(ApplicationPermission.DefineTrace);
  }

  onDefineTraceClicked() {
    this.gisMapService.setHighlightNode(this.rtu.nodeId);
    this.gisMapService.showTraceDefine.next(this.rtu.nodeId);

    this.gisMapService.clearSteps();
    const firstStepRtu = new StepModel();
    firstStepRtu.nodeId = this.rtu.nodeId;
    firstStepRtu.title = this.rtu.title;
    firstStepRtu.equipmentId = this.gisMapService
      .getGeoData()
      .equipments.find((e) => e.nodeId === this.rtu.nodeId)!.id;
    this.gisMapService.addStep(firstStepRtu);
  }
}
