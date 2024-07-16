import { ChangeDetectorRef, Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Rtu } from 'src/app/core/store/models/ft30/rtu';

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
  @Input() rtu!: Rtu;

  public open = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onRtuNameClicked() {
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

  onAutomaticBaseRefsClicked() {
    //
  }

  onMonitoringSettingsClicked() {
    //
  }

  onManualModeClicked() {
    //
  }

  onClicked() {
    //
  }
}
