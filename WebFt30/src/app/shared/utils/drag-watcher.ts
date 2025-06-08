import { CdkDragStart, CdkDragMove } from '@angular/cdk/drag-drop';

/*
можно применять к модальным и не модальным окнам NodeInfo / Landmarks
в компонент добавить:
  @ViewChild(CdkDrag) dragRef!: CdkDrag;
  dragWatcher = DragWatcher;

  ngAfterViewInit() {
    this.dragRef.setFreeDragPosition({ x: 100, y: 50 });
  }

в шаблоне большая обертка вокруг контента, включая:
 подключение обработчиков тягания
  (cdkDragMoved)="dragWatcher.onDragMoved($event)"
  (cdkDragStarted)="dragWatcher.onDragStarted($event)"

  class="draggable-window
  содержит fixed left-0 top-0 - именно 0,0 для правильных расчетов
*/

export class DragWatcher {
  private static dragStartOffset = { x: 0, y: 0 };

  static onDragStarted(event: CdkDragStart) {
    // Получаем позицию курсора и позицию элемента при начале перетаскивания
    const pointerPosition = this.getPointerPosition(event.event);
    const rect = event.source.element.nativeElement.getBoundingClientRect();

    // Рассчитываем смещение курсора внутри элемента
    this.dragStartOffset = {
      x: pointerPosition.x - rect.left,
      y: pointerPosition.y - rect.top
    };
  }

  private static getPointerPosition(event: Event): { x: number; y: number } {
    if (event instanceof MouseEvent) {
      return { x: event.clientX, y: event.clientY };
    } else if (event instanceof TouchEvent) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
    return { x: 0, y: 0 };
  }

  static onDragMoved(event: CdkDragMove) {
    const el = event.source.element.nativeElement;
    const viewport = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    const rect = el.getBoundingClientRect();
    const visibleWidth = 80; // Видимая часть 80px

    // Получаем текущую позицию курсора
    const pointerPosition = this.getPointerPosition(event.event);

    // Рассчитываем новую позицию элемента
    const newX = pointerPosition.x - this.dragStartOffset.x;
    const newY = pointerPosition.y - this.dragStartOffset.y;

    // Применяем ограничения
    event.source.setFreeDragPosition({
      x: Math.min(
        Math.max(
          -rect.width + visibleWidth, // Форма скрыта кроме 80px
          newX
        ),
        viewport.w - visibleWidth // Форма скрыта кроме 80px
      ),
      y: Math.min(Math.max(0, newY), viewport.h - 40)
    });
  }
}
