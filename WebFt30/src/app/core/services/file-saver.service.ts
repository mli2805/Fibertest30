import { Injectable } from '@angular/core';
import * as saveAs from 'file-saver';
import { AppState } from '../core.state';
import { Store } from '@ngrx/store';
import { CoreUtils } from '../core.utils';
import { OtauPortPath } from '../store/models';
import { OtausSelectors, TimeSettingsSelectors } from 'src/app/core';

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

  static getPortPathStringForFileName(portPath: OtauPortPath): string {
    if (portPath.cascadePort == null) {
      return portPath.ocmPort.portIndex.toString();
    }
    return `${portPath.ocmPort.portIndex}-${portPath.cascadePort.portIndex}`;
  }

  getSorFileName(prefix: string, monitoringPortId: number, at: Date, extension = 'sor'): string {
    const port = CoreUtils.getCurrentState(
      this.store,
      OtausSelectors.selectOtauPathByMonitoringPortId(monitoringPortId)
    );

    const timezone = CoreUtils.getCurrentState(this.store, TimeSettingsSelectors.selectTimeZone);

    const atStr = FileSaverService.getDateTimeStringForFileName(at, timezone.ianaId);
    const portPathStr = port == null ? '' : FileSaverService.getPortPathStringForFileName(port!);

    return `${prefix}-[${portPathStr}]-[${atStr}].${extension}`;
  }

  saveAs(data: Uint8Array, filename: string): void {
    saveAs(new Blob([data]), filename);
  }
}
