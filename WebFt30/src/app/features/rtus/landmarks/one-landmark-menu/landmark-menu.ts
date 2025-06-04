import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { GraphService } from 'src/app/core/grpc';
import { GeoTrace } from 'src/app/core/store/models/ft30/geo-data';
import { OneLandmark } from 'src/app/core/store/models/ft30/one-landmark';
import { TraceEquipmentSelectorComponent } from 'src/app/features/gis/forms/trace-equipment-selector/trace-equipment-selector.component';
import { GisMapService } from 'src/app/features/gis/gis-map.service';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { EquipmentPipe } from 'src/app/shared/pipes/equipment.pipe';

export class LandmarkMenu {
  private static dialog: Dialog;
  private static ts: TranslateService;
  private static equipmentPipe: EquipmentPipe;
  private static gisMapService: GisMapService;
  private static graphService: GraphService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.graphService = injector.get(GraphService);
    this.ts = injector.get(TranslateService);
    this.equipmentPipe = injector.get(EquipmentPipe);
    this.dialog = injector.get(Dialog);
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
    const buttons = new Array<RadioButton>();
    const node = this.gisMapService.getNode(landmark.nodeId);

    const equips = this.gisMapService
      .getGeoData()
      .equipments.filter((e) => e.nodeId === node.id)
      .sort((a, b) => b.type - a.type); // последним должен оказаться EmptyNode

    // последний не шлем, это EmtpyNode, вместо него будет написано Не использовать оборудование
    for (let i = 0; i < equips.length - 1; i++) {
      const equipment = equips[i];
      const button = {
        id: i,
        isSelected: equipment.id === landmark.equipmentId,
        title: this.ts.instant(this.equipmentPipe.transform(equipment.type)),
        equipment
      };
      buttons.push(button);
    }

    // открываем диалог для выбора оборудования в узле для этой трассы
    const dialogConfig = new DialogConfig<unknown, DialogRef>();
    dialogConfig.positionStrategy = new GlobalPositionStrategy().right('120px').top('150px');
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      buttons,
      fromLandmarks: true,
      node,
      gisMapService: this.gisMapService,
      hasAnyBaseRef: trace.hasAnyBaseRef,
      isLast: isLast
    };
    const dialogRef = this.dialog.open(TraceEquipmentSelectorComponent, dialogConfig);

    // и ждем здесь пока закроется диалог
    // вернет null если отказался от выбора (нажал Отменить или крестик)
    const index = <number | null>await firstValueFrom(dialogRef.closed);
    if (index === null) return;
    // сохранение изменение названия узла и полей оборудования происходит внутри диалога по нажатию Далее
    // а вот если поменялось оборудование для трассы, то это надо сохранить здесь
    // если index === -1 - выбрано не использовать оборудование
    const newEquipmentId = index === -1 ? equips.at(-1)!.id : equips[index].id;
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
