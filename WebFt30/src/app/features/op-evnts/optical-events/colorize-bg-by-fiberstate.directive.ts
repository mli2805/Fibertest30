import { Input, ElementRef, Renderer2, Directive } from '@angular/core';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

@Directive({
  selector: '[rtuColorizeBgByFiberState]'
})
export class FiberStateBgDirective {
  @Input() set rtuColorizeBgByFiberState(state: FiberState) {
    this.applyBgColor(state);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyBgColor(state: FiberState) {
    const { nativeElement } = this.el;

    switch (state) {
      case FiberState.Ok:
        break;
      case FiberState.Suspicion:
        this.renderer.addClass(nativeElement, 'bg-[#ffff00]');
        this.renderer.addClass(nativeElement, 'dark:text-black');
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
