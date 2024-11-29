import { Injectable } from '@angular/core';
import * as saveAs from 'file-saver';

@Injectable({ providedIn: 'root' })
export class FileSaverService {
  saveAs(data: Uint8Array, filename: string): void {
    saveAs(new Blob([data]), filename);
  }
}
