import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';

@Component({
  selector: 'rtu-free-port-menu',
  templateUrl: './free-port-menu.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ]
})
export class FreePortMenuComponent {
  store: Store<AppState> = inject(Store<AppState>);
  currentUser: User | null;

  @Input() portOfOtau!: PortOfOtau;
  @Input() isRtuAvailableNow!: boolean;

  public open = false;

  constructor(private elementRef: ElementRef, private router: Router) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  onFreePortNameClicked() {
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

  canAttachTrace() {
    return this.hasPermission(ApplicationPermission.AttachTrace);
  }

  onAttachTraceClicked() {
    //
  }

  canAttachBop() {
    return this.hasPermission(ApplicationPermission.AttachBop);
  }

  onAttachBopClicked() {
    //
  }

  canMeasurementClient() {
    return this.hasPermission(ApplicationPermission.DoMeasurementClient) && this.isRtuAvailableNow;
  }

  onMeasurementClientClicked() {
    let portName!: string;
    if (this.portOfOtau.isPortOnMainCharon) {
      portName = `${this.portOfOtau.opticalPort}`;
    } else {
      portName = `${this.portOfOtau.mainCharonPort}-${this.portOfOtau.opticalPort}`;
    }
    this.router.navigate([`rtus/measurement-client/`, this.portOfOtau.rtuId, portName]);
  }
}
