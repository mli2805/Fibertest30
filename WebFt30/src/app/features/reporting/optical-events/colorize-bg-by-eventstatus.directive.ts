import { ElementRef, Input, Renderer2, Directive } from '@angular/core';
import { EventStatus } from 'src/app/core/store/models/ft30/ft-enums';

@Directive({
  selector: '[rtuColorizeBgByEventStatus]'
})
export class EventStatusBgDirective {
  @Input() set rtuColorizeBgByEventStatus(status: EventStatus) {
    this.applyBgColor(status);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyBgColor(status: EventStatus) {
    const { nativeElement } = this.el;

    switch (status) {
      case EventStatus.JustMeasurementNotAnEvent:
      case EventStatus.EventButNotAnAccident:
      case EventStatus.NotConfirmed:
        break;
      case EventStatus.Confirmed:
        this.renderer.addClass(nativeElement, 'bg-[#ff0000]');
        break;
      case EventStatus.Suspended:
      case EventStatus.Unprocessed:
        this.renderer.addClass(nativeElement, 'bg-[#87cefa]');
        this.renderer.addClass(nativeElement, 'dark:text-black');
        break;
    }
  }
}
