import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() portOfOtau!: PortOfOtau;

  public open = false;

  constructor(private elementRef: ElementRef, private router: Router) {}

  onFreePortNameClicked() {
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

  onClicked() {
    //
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
