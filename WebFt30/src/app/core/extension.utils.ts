import { PortOfOtau } from './store/models/ft30/port-of-otau';

export class ExtensionUtils {
  public static PortOfOtauToString(port: PortOfOtau | null): string {
    if (port === null) return 'i18n.ft.not-attached';

    return port.isPortOnMainCharon
      ? port.opticalPort.toString()
      : `${port.mainCharonPort} - ${port.opticalPort}`;
  }
}
