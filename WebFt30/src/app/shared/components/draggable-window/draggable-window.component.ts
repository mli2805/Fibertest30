import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { DragWatcher } from '../../utils/drag-watcher';
import { WindowService } from 'src/app/app/pages/start-page/components/window.service';

// тягаемые окна
// start-page.component.html
export type ManagedWindow =
  | 'RtuState'
  | 'Landmarks'
  | 'TraceAssignBaseRefs'
  | 'RftsEvents'
  | 'NetworkSettings'
  | 'TraceDefine'
  | 'NodeInfo'
  | 'FiberInfo'
  | 'RtuInfo'
  | 'BopInfo'
  | 'TraceInfo'
  | 'TraceAttach'
  | 'BopAttach'
  | 'OutOfTurnMeasurement';

@Component({
  selector: 'rtu-draggable-window',
  templateUrl: './draggable-window.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableWindowComponent implements AfterViewInit {
  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  @Input() caption!: string;
  @Input() modal = true;
  @Input() left!: number | null;
  @Input() top!: number | null;
  @Input() closeOnEscape = true;
  @Input() windowName!: ManagedWindow;
  @Input() windowId!: string;
  @Input() zIndex = 100;

  @Output() closeEvent = new EventEmitter<void>();

  constructor(private windowService: WindowService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.left == null || this.top == null) {
      // Получаем размеры viewport'а
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Получаем размеры DOM-элемента окна
      const element = this.dragRef.element.nativeElement as HTMLElement;
      const rect = element.getBoundingClientRect();

      // Вычисляем центр
      const x = (viewportWidth - rect.width) / 2;
      const y = (viewportHeight - rect.height) / 2;

      this.dragRef.setFreeDragPosition({ x, y });
    } else {
      this.dragRef.setFreeDragPosition({ x: this.left, y: this.top });
    }
  }

  close() {
    this.closeEvent.next();
  }

  // временно закоментил
  // надо реализовать нормально bringToFront, тогда можно будет определять кто сейчас активный и тогда можно по Escape закрывать активный
  // @HostListener('document:keydown.escape', ['$event'])
  // handleEscape() {
  //   if (this.closeOnEscape) this.close();
  // }

  bringToFront() {
    // console.log(`bringToFront ${this.windowId} ${this.windowName}`);
    this.windowService.bringToFront(this.windowId, this.windowName);
    this.updateZIndex();
  }

  private updateZIndex() {
    const windowData = this.windowService.getWindows().find((w) => w.id === this.windowId);
    // Обновляем только если значение изменилось
    if (windowData?.zIndex !== this.zIndex) {
      this.zIndex = windowData?.zIndex || 1;
    }
  }
}
