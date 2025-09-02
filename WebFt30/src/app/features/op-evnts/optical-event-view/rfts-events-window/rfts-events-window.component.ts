import { Component, HostListener, Input } from '@angular/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { RftsEvents } from 'src/app/core/store/models/ft30/rfts-events-dto';

@Component({
    selector: 'rtu-rfts-events-window',
    templateUrl: './rfts-events-window.component.html',
    standalone: false
})
export class RftsEventsWindowComponent {
  fiberState = FiberState;
  @Input() windowId!: string;
  @Input() zIndex!: number;

  selectedLevel = 0;

  @Input() rftsEvents!: RftsEvents;

  constructor(private windowService: WindowService) {}

  selectTab(i: number) {
    this.selectedLevel = i;
  }

  close() {
    this.windowService.unregisterWindow(this.windowId, 'RftsEvents');
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
