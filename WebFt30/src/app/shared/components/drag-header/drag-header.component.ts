import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'rtu-drag-header',
    templateUrl: './drag-header.component.html',
    standalone: false
})
export class DragHeaderComponent {
  @Input() caption!: string;

  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.closeEvent.next();
  }
}
