import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { AppState } from '../core.state';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class FileSaverService {
  constructor(private store: Store<AppState>) {}

  static getDateTimeStringForFileName(date: Date, timezoneIanaId: string): string {
    const getValue = (options: Intl.DateTimeFormatOptions): string => {
      return new Intl.DateTimeFormat('en', { ...options, timeZone: timezoneIanaId }).format(date);
    };

    // kind of dumb, but does what I need
    const year = getValue({ year: 'numeric' });
    const month = getValue({ month: '2-digit' });
    const day = getValue({ day: '2-digit' });
    const hour = getValue({ hour: '2-digit', hour12: false });
    const minute = getValue({ minute: '2-digit' });
    const second = getValue({ second: '2-digit' });

    return `${year}-${month}-${day} ${hour}-${minute}-${second}`;
  }

  getSorFileName(prefix: string, monitoringPortId: number, at: Date, extension = 'sor'): string {
    return `${prefix}-[${monitoringPortId}]-[${at}].${extension}`;
  }

  saveAs(data: Uint8Array, filename: string): void {
    saveAs(new Blob([data]), filename);
  }
}
