import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Trace } from 'src/app/core/store/models/ft30/trace';

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
  onAssignBaseRefsClicked() {
    //
  }
}
