import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Bop } from 'src/app/core/store/models/ft30/bop';

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

  constructor(private elementRef: ElementRef, private router: Router) {}

  onBopNameClicked() {
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

  onRemoveClicked() {
    //
  }
}
