import { Injector } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { ColoredLandmark } from 'src/app/core/store/models/ft30/colored-landmark';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
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
    landmark: ColoredLandmark | null,
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

  static async equipmentOfLandmark(
    landmark: ColoredLandmark,
    trace: GeoTrace,
    isLast: boolean
  ): Promise<string | null> {
    const node = this.gisMapService.getNode(landmark.nodeId);
    const newEquipmentId = await TraceEquipmentUtil.selectEquipment(
      node,
      true,
      landmark.equipmentId,
      trace.hasAnyBaseRef,
      isLast
    );

    return newEquipmentId;

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

  static nodeOfLandmark(landmark: ColoredLandmark) {
    this.gisMapService.setShowNodeInfoDialog(landmark.nodeId, true);
  }

  static sectionOfLandmark(landmark: ColoredLandmark) {
    this.gisMapService.setShowSectionInfoDialog(landmark.fiberId, true);
  }
}
