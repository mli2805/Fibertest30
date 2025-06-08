import { CdkDrag } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, HostListener, Input, ViewChild } from '@angular/core';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { RftsEvents } from 'src/app/core/store/models/ft30/rfts-events-dto';
import { DragWatcher } from 'src/app/shared/utils/drag-watcher';

@Component({
  selector: 'rtu-rfts-events-window',
  templateUrl: './rfts-events-window.component.html'
})
export class RftsEventsWindowComponent implements AfterViewInit {
  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  fiberState = FiberState;
  @Input() windowId!: string;

  selectedLevel = 0;

  @Input() rftsEvents!: RftsEvents;

  constructor(private windowService: WindowService) {}

  ngAfterViewInit() {
    this.dragRef.setFreeDragPosition({ x: 190, y: 110 });
  }

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

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape() {
    this.close();
  }
}
