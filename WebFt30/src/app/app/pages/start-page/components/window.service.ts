import { Injectable } from '@angular/core';

type ManagedWindow = 'RtuState' | 'TraceState' | 'Landmarks';

interface WindowData {
  id: string;
  zIndex: number;
  type: ManagedWindow;
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private windows: WindowData[] = [];
  private maxZIndex = 1;

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

  registerWindow(id: string, type: ManagedWindow) {
    this.maxZIndex += 1;

    const idx = this.windows.findIndex((w) => w.id === id && w.type === type);
    // если уже было открыто такое окно
    if (idx !== -1) {
      this.windows.splice(idx, 1);
    }

    this.windows.push({ id: id, type: type, zIndex: this.maxZIndex });
  }

  unregisterWindow(id: string, type: ManagedWindow) {
    console.log(`unregisterWindow`);
    this.windows = this.windows.filter((w) => w.id !== id || w.type !== type);
  }
}
