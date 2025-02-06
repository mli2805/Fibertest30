import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { AppState, AuthSelectors, RtuTreeSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';
import { Trace } from 'src/app/core/store/models/ft30/trace';
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
  onCleanClicked() {
    //
  }

  canRemove() {
    return this.hasPermission(ApplicationPermission.RemoveTrace);
  }
  onRemoveClicked() {
    //
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
