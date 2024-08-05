import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() trace!: Trace;

  public open = false;

  constructor(private elementRef: ElementRef, private router: Router) {}

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

  onClicked() {
    //
  }
}
