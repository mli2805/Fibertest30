import { Injector } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { OneLandmark } from 'src/app/core/store/models/ft30/one-landmark';
import { TraceEquipmentUtil } from 'src/app/features/gis/forms/trace-equipment-selector/trace-equipment-util';
import { GisMapService } from 'src/app/features/gis/gis-map.service';

export class LandmarkMenu {
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);

    TraceEquipmentUtil.initialize(injector);
  }

  static handleMenuAction(
    action: string,
    landmark: OneLandmark | null,
    trace: GeoTrace,
    isLast: boolean
  ) {
    if (!landmark) return;

    switch (action) {
      case 'equipment':
        this.equipmentOfLandmark(landmark, trace, isLast);
        break;
      case 'node':
        this.nodeOfLandmark(landmark);
        break;
      case 'section':
        this.sectionOfLandmark(landmark);
        break;
    }
  }

  static async equipmentOfLandmark(landmark: OneLandmark, trace: GeoTrace, isLast: boolean) {
    const node = this.gisMapService.getNode(landmark.nodeId);
    const newEquipmentId = await TraceEquipmentUtil.selectEquipment(
      node,
      true,
      landmark.equipmentId,
      trace.hasAnyBaseRef,
      isLast
    );

    // это не надо , надо будет просто возвращать выбор и сохранять в основной форме для пакетного применения
    if (newEquipmentId !== landmark.equipmentId) {
      const command = {
        TraceId: trace.id,
        IndexInTrace: landmark.numberIncludingAdjustmentPoints,
        EquipmentId: newEquipmentId
      };
      const json = JSON.stringify(command);
      await firstValueFrom(this.graphService.sendCommand(json, 'IncludeEquipmentIntoTrace'));
    }
  }

  static nodeOfLandmark(landmark: OneLandmark) {
    this.gisMapService.setShowNodeInfoDialog(landmark.nodeId, true);
  }

  static sectionOfLandmark(landmark: OneLandmark) {
    this.gisMapService.setShowSectionInfoDialog(landmark.fiberId, true);
  }
}
