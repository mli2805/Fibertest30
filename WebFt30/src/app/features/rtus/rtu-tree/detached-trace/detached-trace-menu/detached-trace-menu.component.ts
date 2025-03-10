import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, firstValueFrom, Observable } from 'rxjs';
import { AppState, AuthSelectors, RtuTreeSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { GraphService } from 'src/app/core/grpc';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
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
    public graphService: GraphService
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

  async onInformationClicked() {
    this.open = false;
    await Utils.delay(100);

    const path = `rtus/trace-information/${this.trace.traceId}`;
    this.router.navigate([path]);
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
    await Utils.delay(100);

    const path = `rtus/trace-landmarks/${this.trace.traceId}`;
    this.router.navigate([path]);
  }

  canClean() {
    return this.hasPermission(ApplicationPermission.CleanTrace);
  }
  // на команду должны отреагировать все клиенты, не только тот который подал команду
  // значит, отправляем на сервер, а когда в start-page придет подтв успеха, применяем к графу/карте
  async onCleanClicked() {
    const cmd = {
      TraceId: this.trace.traceId
    };
    const json = JSON.stringify(cmd);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'CleanTrace'));
    if (!response.success) return;

    const externalCmd = { name: 'CleanTrace', traceId: this.trace.traceId };
    console.log(externalCmd);
    console.log(this.gisMapService.externalCommand.value);
    this.gisMapService.externalCommand.next(externalCmd);
  }

  canRemove() {
    return this.hasPermission(ApplicationPermission.RemoveTrace);
  }

  async onRemoveClicked() {
    const cmd = {
      TraceId: this.trace.traceId
    };
    const json = JSON.stringify(cmd);
    const response = await firstValueFrom(this.graphService.sendCommand(json, 'RemoveTrace'));
    if (!response.success) return;

    const externalCmd = { name: 'RemoveTrace', traceId: this.trace.traceId };
    console.log(externalCmd);
    console.log(this.gisMapService.externalCommand.value);
    this.gisMapService.externalCommand.next(externalCmd);
  }

  canAssignBaseRefs() {
    return this.hasPermission(ApplicationPermission.AssignBaseRef);
  }
  async onAssignBaseRefsClicked() {
    this.open = false;
    await Utils.delay(100);

    this.router.navigate([`rtus/assign-base/`, this.trace.rtuId, this.trace.traceId]);
  }
}
