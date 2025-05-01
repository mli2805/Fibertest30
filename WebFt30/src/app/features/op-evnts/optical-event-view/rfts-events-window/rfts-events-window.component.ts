import { Component, Input } from '@angular/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { RftsEvents } from 'src/app/core/store/models/ft30/rfts-events-dto';

@Component({
  selector: 'rtu-rfts-events-window',
  templateUrl: './rfts-events-window.component.html'
})
export class RftsEventsWindowComponent {
  fiberState = FiberState;
  @Input() windowId!: string;

  selectedLevel = 0;

  @Input() rftsEvents!: RftsEvents;

  constructor(private windowService: WindowService) {}

  selectTab(i: number) {
    this.selectedLevel = i;
  }

  /////////////////////////
  zIndex = 1;
  bringToFront() {
    this.windowService.bringToFront(this.windowId, 'RftsEvents');
    this.updateZIndex();
  }

  private updateZIndex() {
    const windowData = this.windowService.getWindows().find((w) => w.id === this.windowId);
    // Обновляем только если значение изменилось
    if (windowData?.zIndex !== this.zIndex) {
      this.zIndex = windowData?.zIndex || 1;
    }
  }

  close() {
    this.windowService.unregisterWindow(this.windowId, 'RftsEvents');
  }
}
