import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, User } from 'src/app/core';
import { CoreUtils } from 'src/app/core/core.utils';
import { ApplicationPermission } from 'src/app/core/models/app-permissions';
import { PortOfOtau } from 'src/app/core/store/models/ft30/port-of-otau';
import { TraceAttachComponent } from '../../../trace-attach/trace-attach.component';
import { Trace } from 'src/app/core/store/models/ft30/trace';
import { BopAttachComponent } from '../../../bop-attach/bop-attach.component';
import { Utils } from 'src/app/shared/utils/utils';

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
  @Input() detachedTraces!: Trace[];

  public open = false;

  constructor(private elementRef: ElementRef, private router: Router, private dialog: Dialog) {
    this.currentUser = CoreUtils.getCurrentState(this.store, AuthSelectors.selectUser);
  }

  hasPermission(permission: ApplicationPermission): boolean {
    return this.currentUser ? this.currentUser.permissions.includes(permission) : false;
  }

  overlayX = 0;
  overlayY = 0;

  // left & right mouse button
  onFreePortNameClicked(event: MouseEvent) {
    if (this.open === false) {
      this.open = true;
    }

    // event.offsetX - смещение от каждого элементика внутри полосы - квадратика, строки
    this.overlayX = event.clientX - 236; // поэтому приходится брать clientX
    this.overlayY = event.offsetY - 10;

    return false; // prevent browser menu
  }

  onOverlayClick(event: MouseEvent) {
    event.stopPropagation();
    this.open = false;
  }

  // @HostListener('document:click', ['$event']) // левая кнопка
  // @HostListener('document:contextmenu', ['$event']) // правая кнопка
  // onClickEverywhere(event: MouseEvent) {
  //   // this means Outside overlay
  //   if (!this.elementRef.nativeElement.contains(event.target)) {
  //     this.open = false;
  //   }
  // }

  // когда мышка покидает саму полоску и оверлей с меню - закрывает меню
  mouseOver = 0;

  async onMouseLeave() {
    await Utils.delay(200);

    this.mouseOver = this.mouseOver - 1;
    if (this.mouseOver === -1) {
      this.mouseOver = 0;
      this.open = false;
    }
  }

  onMouseEnter() {
    this.mouseOver = this.mouseOver + 1;
  }
  ////////////////

  canAttachTrace() {
    return this.hasPermission(ApplicationPermission.AttachTrace) && this.detachedTraces.length > 0;
  }

  onAttachTraceClicked() {
    this.dialog.open(TraceAttachComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { traces: this.detachedTraces, portOfOtau: this.portOfOtau }
    });
  }

  canAttachBop() {
    return this.hasPermission(ApplicationPermission.AttachBop);
  }

  async onAttachBopClicked() {
    await this.openAttachOtauDialog();
  }

  private async openAttachOtauDialog() {
    this.dialog.open(BopAttachComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      disableClose: true,
      data: { portOfOtau: this.portOfOtau }
    });
  }

  canMeasurementClient() {
    return this.hasPermission(ApplicationPermission.DoMeasurementClient) && this.isRtuAvailableNow;
  }

  async onMeasurementClientClicked() {
    let portName!: string;
    if (this.portOfOtau.isPortOnMainCharon) {
      portName = `${this.portOfOtau.opticalPort}`;
    } else {
      portName = `${this.portOfOtau.mainCharonPort}-${this.portOfOtau.opticalPort}`;
    }

    this.open = false;
    await Utils.delay(100);

    this.router.navigate([`rtus/measurement-client/`, this.portOfOtau.rtuId, portName]);
  }
}
