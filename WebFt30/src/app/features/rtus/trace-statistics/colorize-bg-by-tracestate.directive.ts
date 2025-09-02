import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { BaseRefType, FiberState } from 'src/app/core/store/models/ft30/ft-enums';

@Directive({
    selector: '[rtuColorizeBgByTraceState]',
    standalone: false
})
export class TraceStateBgDirective {
  @Input() set rtuColorizeBgByTraceState(data: any) {
    this.applyBgColor(data);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyBgColor(data: any) {
    const { nativeElement } = this.el;

    if (data.baseRefType === BaseRefType.Fast) {
      this.renderer.addClass(nativeElement, 'bg-[#ffff00]');
      this.renderer.addClass(nativeElement, 'dark:text-black');
      return;
    }

    switch (data.traceState) {
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
