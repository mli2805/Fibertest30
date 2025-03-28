import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, RtuTreeActions, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { Bop } from 'src/app/core/store/models/ft30/bop';
import { DetachOtauDto } from 'src/app/core/store/models/ft30/detach-otau-dto';

@Component({
  selector: 'rtu-one-bop-menu',
  templateUrl: './one-bop-menu.component.html',
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ]
})
export class OneBopMenuComponent {
  store: Store<AppState> = inject(Store<AppState>);
  currentUser: User | null;

  private _bop!: Bop;
  @Input() set bop(value: Bop) {
    this._bop = value;
    this.lineContent = `N${this._bop.masterPort}: ${this._bop.bopNetAddress!.toString()}`;
  }
  get bop() {
    return this._bop;
  }
  lineContent!: string;

  public open = false;

  @Input() isRtuAvailableNow!: boolean;
  @Input() isMonitoringOn!: boolean;

  constructor(private elementRef: ElementRef, private router: Router) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }
  onBopNameClicked() {
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

  canRemove() {
    return (
      this.hasPermission(ApplicationPermission.RemoveBop) &&
      this.isRtuAvailableNow &&
      !this.isMonitoringOn
    );
  }

  onRemoveClicked() {
    const dto = new DetachOtauDto();
    dto.rtuId = this._bop.rtuId;
    dto.otauId = this._bop.bopId;
    dto.netAddress = this._bop.bopNetAddress;
    dto.opticalPort = this._bop.masterPort;
    this.store.dispatch(RtuTreeActions.detachOtau({ dto }));
  }
}
