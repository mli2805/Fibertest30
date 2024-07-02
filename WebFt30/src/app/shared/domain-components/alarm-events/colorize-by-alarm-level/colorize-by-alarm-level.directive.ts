import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { MonitoringAlarmLevel } from 'src/app/core/store/models';

@Directive({
  selector: '[rtuColorizeByAlarmLevel], [rtuColorizeByAlarmLevelWithHover]'
})
export class AlarmLevelDirective {
  private lastLevel: MonitoringAlarmLevel | null = null;
  private lastClasses: string[] = [];

  @Input() set rtuColorizeByAlarmLevel(level: MonitoringAlarmLevel) {
    this.applyColor(level, false);
  }

  @Input() set rtuColorizeByAlarmLevelWithHover(level: MonitoringAlarmLevel) {
    this.applyColor(level, true);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private applyColor(level: MonitoringAlarmLevel, isHover: boolean): void {
    if (this.lastLevel === level) {
      return;
    }
    this.lastLevel = level;

    this.lastClasses.forEach((c) => this.renderer.removeClass(this.el.nativeElement, c));
    this.lastClasses = [];

    switch (level) {
      case MonitoringAlarmLevel.Minor:
        this.addClass('text-yellow-400');
        this.addClass('dark:text-yellow-300');
        if (isHover) {
          this.addClass('hover:text-yellow-500');
          this.addClass('dark:hover:text-yellow-400');
        }
        break;
      case MonitoringAlarmLevel.Critical:
        this.addClass('text-red-500');
        this.addClass('dark:text-red-500');
        if (isHover) {
          this.addClass('hover:text-red-600');
          this.addClass('dark:hover:text-red-600');
        }
        break;
      case MonitoringAlarmLevel.Major:
        this.addClass('text-orange-500');
        this.addClass('dark:text-orange-400');
        if (isHover) {
          this.addClass('hover:text-orange-600');
          this.addClass('dark:hover:text-orange-500');
        }
        break;
      default:
        break;
    }
  }

  private addClass(className: string) {
    const { nativeElement } = this.el;

    this.renderer.addClass(nativeElement, className);
    this.lastClasses.push(className);
  }
}
