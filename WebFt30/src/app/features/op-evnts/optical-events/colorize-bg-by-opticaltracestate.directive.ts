import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { BaseRefType, FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { OpticalEvent } from 'src/app/core/store/models/ft30/optical-event';

@Directive({
  selector: '[rtuColorizeBgByOpticalTraceState]'
})
export class OpticalTraceStateBgDirective {
  @Input() set rtuColorizeBgByOpticalTraceState(opticalEvent: OpticalEvent) {
    this.applyBgColor(opticalEvent);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyBgColor(opticalEvent: OpticalEvent) {
    const { nativeElement } = this.el;

    if (opticalEvent.baseRefType === BaseRefType.Fast) {
      this.renderer.addClass(nativeElement, 'bg-[#ffff00]');
      this.renderer.addClass(nativeElement, 'dark:text-black');
      return;
    }

    switch (opticalEvent.traceState) {
      case FiberState.Ok:
        break;
      case FiberState.Minor:
        this.renderer.addClass(nativeElement, 'bg-[#8080c0]');
        break;
      case FiberState.Major:
        this.renderer.addClass(nativeElement, 'bg-[#ff69b4]');
        break;
      case FiberState.Critical:
      case FiberState.FiberBreak:
      case FiberState.NoFiber:
        this.renderer.addClass(nativeElement, 'bg-red-500');
        this.renderer.addClass(nativeElement, 'text-white');
        break;
      case FiberState.User:
        this.renderer.addClass(nativeElement, 'bg-[#008000]');
        break;
    }
  }
}
