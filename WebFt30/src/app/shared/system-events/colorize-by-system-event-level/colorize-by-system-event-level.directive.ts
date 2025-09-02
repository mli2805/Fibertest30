import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { SystemEventLevel } from 'src/app/core/store/models';

@Directive({
    selector: '[rtuColorizeBySystemEventLevel], [rtuColorizeBySystemEventLevelWithHover]',
    standalone: false
})
export class SystemEventLevelDirective {
  @Input() set rtuColorizeBySystemEventLevel(level: SystemEventLevel) {
    this.applyColor(level, false);
  }

  @Input() set rtuColorizeBySystemEventLevelWithHover(level: SystemEventLevel) {
    this.applyColor(level, true);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyColor(level: SystemEventLevel, isHover: boolean): void {
    const { nativeElement } = this.el;

    switch (level) {
      case SystemEventLevel.Info:
        this.renderer.addClass(nativeElement, 'text-black');
        this.renderer.addClass(nativeElement, 'dark:text-white');
        if (isHover) {
          this.renderer.addClass(nativeElement, 'hover:text-gray-700');
          this.renderer.addClass(nativeElement, 'dark:hover:text-gray-300');
        }
        break;
      case SystemEventLevel.Critical:
        this.renderer.addClass(nativeElement, 'text-red-500');
        this.renderer.addClass(nativeElement, 'dark:text-red-500');
        if (isHover) {
          this.renderer.addClass(nativeElement, 'hover:text-red-600');
          this.renderer.addClass(nativeElement, 'dark:hover:text-red-600');
        }
        break;
      case SystemEventLevel.Major:
        this.renderer.addClass(nativeElement, 'text-orange-500');
        this.renderer.addClass(nativeElement, 'dark:text-orange-400');
        if (isHover) {
          this.renderer.addClass(nativeElement, 'hover:text-orange-600');
          this.renderer.addClass(nativeElement, 'dark:hover:text-orange-500');
        }
        break;
      default:
        break;
    }
  }
}
