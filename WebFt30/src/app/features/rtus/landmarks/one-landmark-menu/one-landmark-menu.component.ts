import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rtu-one-landmark-menu',
  templateUrl: './one-landmark-menu.component.html'
})
export class OneLandmarkMenuComponent {
  @Input() isOpen = false;
  @Input() position = { x: 0, y: 0 };
  @Input() menuItems: { label: string; action: string; disabled: boolean }[] = [];
  @Output() actionSelected = new EventEmitter<string>();

  handleClick(action: string) {
    this.actionSelected.emit(action);
    this.isOpen = false;
  }
}
