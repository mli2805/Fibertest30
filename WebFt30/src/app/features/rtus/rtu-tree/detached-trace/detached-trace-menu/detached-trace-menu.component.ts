import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { AppState, AuthSelectors, RtuTreeActions, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { GraphService } from 'src/app/core/grpc';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { MessageBoxUtils } from 'src/app/shared/components/message-box/message-box-utils';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'rtu-detached-trace-menu',
  templateUrl: './detached-trace-menu.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ]
})
export class DetachedTraceMenuComponent {
  store: Store<AppState> = inject(Store<AppState>);
  currentUser: User | null;

  @Input() rtu!: Rtu;
  @Input() trace!: Trace;

  public open = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    public gisMapService: GisMapService,
    public graphService: GraphService,
    private windowService: WindowService,
    private dialog: Dialog,
    private ts: TranslateService
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

  @HostListener('document:click', ['$event']) // левая кнопка
  @HostListener('document:contextmenu', ['$event']) // правая кнопка
  onClickEverywhere(event: MouseEvent) {
    // this means Outside overlay
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }

  async onInformationClicked() {
    this.windowService.registerWindow(this.trace.traceId, 'TraceInfo', null);
  }

  onShowClicked() {
    const externalCmd = { name: 'ShowTrace', traceId: this.trace.traceId };
    this.gisMapService.externalCommand.next(externalCmd);
  }

  onStateClicked() {
    //
  }

  async onStatisticsClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/trace-statistics/${this.trace.traceId}`;
    this.router.navigate([path]);
  }

  async onLandmarksClicked() {
    this.open = false;
    const windowId = crypto.randomUUID();
    this.windowService.registerWindow(windowId, 'Landmarks', {
      traceId: this.trace.traceId,
      nodeId: null
    });
  }

  canClean() {
    return this.hasPermission(ApplicationPermission.CleanTrace);
  }
  // на команду должны отреагировать все клиенты, не только тот который подал команду
  // значит, отправляем на сервер, а когда в start-page придет подтв успеха, применяем к графу/карте
  async onCleanClicked() {
    this.cleanOrRemove('CleanTrace');
  }

  canRemove() {
    return this.hasPermission(ApplicationPermission.RemoveTrace);
  }

  async onRemoveClicked() {
    await this.cleanOrRemove('RemoveTrace');
  }

  async cleanOrRemove(command: string) {
    const confirmation = await MessageBoxUtils.show(this.dialog, 'Confirmation', [
      { message: 'i18n.ft.attention', bold: false, bottomMargin: false },
      { message: 'i18n.ft.all-information-about-the-trace', bold: false, bottomMargin: true },
      { message: this.trace.title, bold: true, bottomMargin: true },
      {
        message:
          command === 'CleanTrace'
            ? 'i18n.ft.except-for-nodes-and-sections'
            : 'i18n.ft.including-nodes-and-sections-not-part-of-other-traces',
        bold: false,
        bottomMargin: true
      },

      { message: 'i18n.ft.will-be-removed', bold: false, bottomMargin: true },
      { message: 'i18n.ft.are-you-sure', bold: false, bottomMargin: false }
    ]);
    if (!confirmation) {
      return;
    }

    this.gisMapService.geoDataLoading.next(true);
    const cmd = {
      TraceId: this.trace.traceId
    };
    const json = JSON.stringify(cmd);
    const response = await this.graphService.sendCommandAsync(json, command);
    this.gisMapService.geoDataLoading.next(false);
  }

  canAssignBaseRefs() {
    return this.hasPermission(ApplicationPermission.AssignBaseRef);
  }

  async onAssignBaseRefsClicked() {
    this.open = false;
    this.windowService.registerWindow(this.trace.traceId, 'TraceAssignBaseRefs', this.trace);
  }
}
