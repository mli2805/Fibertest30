import { Directive, HostBinding, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Directive({
  selector: '[rtuInverseCdkScrollOffset]'
})
export class InverseCdkScrollOffsetDirective {
  constructor(private viewPort: CdkVirtualScrollViewport) {}

  @HostBinding('style.top')
  get styleTop(): string {
    if (!this.viewPort) {
      return '-0px';
    }
    const offset = this.viewPort['_renderedContentOffset'];
    return `-${offset}px`;
  }
}
