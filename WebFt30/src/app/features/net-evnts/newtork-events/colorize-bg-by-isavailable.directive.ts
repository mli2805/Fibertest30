import { ElementRef, Input, Renderer2, Directive } from '@angular/core';

@Directive({
    selector: '[rtuColorizeBgByIsAvailable]',
    standalone: false
})
export class IsAvailableBgDirective {
  @Input() set rtuColorizeBgByIsAvailable(isRtuAvailable: boolean) {
    this.applyBgColor(isRtuAvailable);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyBgColor(isRtuAvailable: boolean) {
    const { nativeElement } = this.el;

    if (!isRtuAvailable) {
      this.renderer.addClass(nativeElement, 'bg-red-500');
      this.renderer.addClass(nativeElement, 'text-white');
    }
  }
}
