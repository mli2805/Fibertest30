import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { TestPortHelpComponent } from '../context-help/components/test-port-help/test-port-help.component';
import { EofThresholdHelpComponent } from '../context-help/components/eof-threshold-help/eof-threshold-help.component';

@Component({
    selector: 'rtu-help-tooltip',
    templateUrl: './help-tooltip.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class HelpTooltipComponent implements OnInit {
  @Input() section!: string;
  public get open() {
    return this.overMark || this.overOverlay;
  }

  overMark = false;
  overOverlay = false;

  cnt!: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    switch (this.section) {
      case 'TestPortHelpComponent':
        this.cnt = TestPortHelpComponent;
        break;
      case 'EofThresholdHelpComponent':
        this.cnt = EofThresholdHelpComponent;
        break;
      default:
        break;
    }
  }

  onMouseOver() {
    this.overMark = true;
  }

  onMouseLeave() {
    setTimeout(this.leaveMark, 100);
  }

  // should be an arrow function otherwise cdr is undefined
  leaveMark = () => {
    this.overMark = false;
    if (this.cdr !== undefined) this.cdr.markForCheck();
  };

  onMouseOverOverlay() {
    this.overOverlay = true;
  }

  onMouseLeaveOverlay() {
    this.overOverlay = false;
  }
}
