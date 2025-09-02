import { ElementRef, Input, Renderer2, Directive } from '@angular/core';
import { ChannelEvent } from 'src/app/core/store/models/ft30/ft-enums';

@Directive({
    selector: '[rtuColorizeBgByChannelEvent]',
    standalone: false
})
export class ChannelEventBgDirective {
  @Input() set rtuColorizeBgByChannelEvent(status: ChannelEvent) {
    this.applyBgColor(status);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyBgColor(status: ChannelEvent) {
    const { nativeElement } = this.el;

    switch (status) {
      case ChannelEvent.Nothing:
      case ChannelEvent.Repaired:
        break;
      case ChannelEvent.Broken:
        this.renderer.addClass(nativeElement, 'bg-red-500');
        this.renderer.addClass(nativeElement, 'text-white');
        break;
    }
  }
}
