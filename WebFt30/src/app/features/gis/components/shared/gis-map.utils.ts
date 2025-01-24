import * as L from 'leaflet';
import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapLayer } from '../../models/gis-map-layer';
import { GisMapIcons } from './gis-map-icons';

export class GisMapUtils {
  static emptyGuid = '00000000-0000-0000-0000-000000000000';

  static createLayerGroupByGisType(layerType: GisMapLayer): L.FeatureGroup {
    if (layerType === GisMapLayer.Route) {
      return L.featureGroup();
    } else {
      // если возвращать featureGroup а не markerClusterGroup
      //  и включить adjustLayersToZoom в обработчике изменения зума,
      // то маркеры будут показываться в зависимости от зума
      // return L.featureGroup();
      return this.getMarkerClusterGroup();
    }
  }

  static getMarkerClusterGroup() {
    return L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        return GisMapIcons.createLetterIcon(cluster.getChildCount().toString());
      },
      disableClusteringAtZoom: 18,
      maxClusterRadius: 180,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false
    });
  }

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

  static equipmentTypeToGisMapLayer(equipmentType: EquipmentType): GisMapLayer {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return GisMapLayer.Route;
      case EquipmentType.Terminal:
      case EquipmentType.Cross:
      case EquipmentType.CableReserve:
      case EquipmentType.Closure:
      case EquipmentType.Other:
        return GisMapLayer.TraceEquipment;
      case EquipmentType.EmptyNode:
        return GisMapLayer.EmptyNodes;
      default:
        return GisMapLayer.AdjustmentPoints;
    }
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

  static latLngToString(latlng: L.LatLng): string {
    const lat = Math.round(latlng.lat * 1000000) / 1000000;
    const lng = Math.round(latlng.lng * 1000000) / 1000000;
    return `${lat} : ${lng}`;
  }

  static mouseToString(mouse: L.LatLng, center: L.LatLng): string {
    return `center: ${GisMapUtils.latLngToString(center)},  mouse: ${GisMapUtils.latLngToString(
      mouse
    )}`;
  }
}
