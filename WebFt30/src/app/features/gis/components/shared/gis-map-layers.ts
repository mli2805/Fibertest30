import { GisMapService } from '../../gis-map.service';
import { GisMapLayer } from '../../models/gis-map-layer';

export class GisMapLayers {
  static adjustLayersToZoom(
    map: L.Map,
    layerGroups: Map<GisMapLayer, L.FeatureGroup>,
    currentZoom: number,
    newZoom: number
  ) {
    const adjustmentPointsZoom = GisMapService.GisMapLayerZoom.get(GisMapLayer.AdjustmentPoints)!;
    if (currentZoom < adjustmentPointsZoom && newZoom >= adjustmentPointsZoom) {
      this.setLayerVisibility(map, layerGroups, GisMapLayer.AdjustmentPoints, true);
    }
    if (currentZoom >= adjustmentPointsZoom && newZoom < adjustmentPointsZoom) {
      this.setLayerVisibility(map, layerGroups, GisMapLayer.AdjustmentPoints, false);
    }

    const emptyNodesZoom = GisMapService.GisMapLayerZoom.get(GisMapLayer.EmptyNodes)!;
    if (currentZoom < emptyNodesZoom && newZoom >= emptyNodesZoom) {
      this.setLayerVisibility(map, layerGroups, GisMapLayer.EmptyNodes, true);
    }
    if (currentZoom >= emptyNodesZoom && newZoom < emptyNodesZoom) {
      this.setLayerVisibility(map, layerGroups, GisMapLayer.EmptyNodes, false);
    }

    const equipmentZoom = GisMapService.GisMapLayerZoom.get(GisMapLayer.TraceEquipment)!;
    if (currentZoom < equipmentZoom && newZoom >= equipmentZoom) {
      this.setLayerVisibility(map, layerGroups, GisMapLayer.TraceEquipment, true);
    }
    if (currentZoom >= equipmentZoom && newZoom < equipmentZoom) {
      this.setLayerVisibility(map, layerGroups, GisMapLayer.TraceEquipment, false);
    }
  }

  static setLayerVisibility(
    map: L.Map,
    layerGroups: Map<GisMapLayer, L.FeatureGroup>,
    layerType: GisMapLayer,
    visible: boolean
  ) {
    if (!map) {
      return;
    }

    const group = layerGroups.get(layerType)!;

    if (!visible && map.hasLayer(group)) {
      map.removeLayer(group);
    }

    if (visible && !map.hasLayer(group)) {
      map.addLayer(group);
    }
  }
}
