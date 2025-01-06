import * as L from 'leaflet';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

export class GisMapUtils {
  static fixLeafletMarkers(): void {
    const iconRetinaUrl = './assets/leaflet/marker-icon-2x.png';
    const iconUrl = './assets/leaflet/marker-icon.png';
    const shadowUrl = './assets/leaflet/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  static fiberStateToColorClass(fiberstate: FiberState): string {
    switch (fiberstate) {
      case FiberState.NoFiber:
      case FiberState.FiberBreak:
      case FiberState.Critical:
        return 'alarm-critical-map';
      case FiberState.Major:
        return 'alarm-major-map';
      case FiberState.Minor:
        return 'alarm-minor-map';
      default:
        throw new Error(`No matching color class found for fiber state ${fiberstate}`);
    }
  }
}
