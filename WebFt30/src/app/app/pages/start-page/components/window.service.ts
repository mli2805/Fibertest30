import { Injectable } from '@angular/core';
import { ManagedWindow } from 'src/app/shared/components/draggable-window/draggable-window.component';

interface WindowData {
  id: string;
  payload: any;
  zIndex: number;
  type: ManagedWindow;
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private windows: WindowData[] = [];
  private maxZIndex = 2;

  getWindows() {
    return this.windows;
  }

  bringToFront(id: string, type: ManagedWindow) {
    this.maxZIndex += 1;

    // Изменяем существующий объект, а не создаем новый
    const window = this.windows.find((w) => w.id === id && w.type === type);
    if (window) {
      window.zIndex = this.maxZIndex;
    }

    // Триггерим обнаружение изменений
    this.windows = [...this.windows];
  }

  registerWindow(id: string, type: ManagedWindow, payload: any) {
    this.maxZIndex += 1;

    const idx = this.windows.findIndex((w) => w.id === id && w.type === type);
    if (idx !== -1) {
      this.windows.splice(idx, 1);
    }

    this.windows.push({ id: id, type: type, zIndex: this.maxZIndex, payload: payload });
    // Триггерим обнаружение изменений
    this.windows = [...this.windows];
    // this.logOpenWindows();
  }

  unregisterWindow(id: string, type: ManagedWindow) {
    const window = this.windows.find((w) => w.id === id && w.type === type);
    if (!window) return;
    if (window.zIndex === this.maxZIndex) this.maxZIndex--;

    this.windows = this.windows.filter((w) => w.id !== id || w.type !== type);
    // this.logOpenWindows();
  }

  getMaxZindex() {
    return Math.max(...this.windows.map((w) => w.zIndex));
  }

  logOpenWindows() {
    console.log(`Windows:`);
    for (let i = 0; i < this.windows.length; i++) {
      const window = this.windows[i];
      console.log(`${window.zIndex}  ${window.type} ${window.id}`);
    }
  }
}
