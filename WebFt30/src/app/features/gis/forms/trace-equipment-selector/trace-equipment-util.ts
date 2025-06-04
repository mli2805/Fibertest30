import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { RadioButton } from 'src/app/shared/components/svg-buttons/radio-button/radio-button';
import { TraceEquipmentSelectorComponent } from './trace-equipment-selector.component';
import { firstValueFrom } from 'rxjs';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EquipmentPipe } from 'src/app/shared/pipes/equipment.pipe';
import { GisMapService } from '../../gis-map.service';

export class TraceEquipmentUtil {
  private static dialog: Dialog;
  private static ts: TranslateService;
  private static equipmentPipe: EquipmentPipe;
  private static gisMapService: GisMapService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
    this.ts = injector.get(TranslateService);
    this.equipmentPipe = injector.get(EquipmentPipe);
    this.dialog = injector.get(Dialog);
  }

  static async selectEquipment(
    node: TraceNode,
    fromLandmarks: boolean,
    equipmentId: string | null = null,
    hasAnyBaseRef = false,
    isLast = false
  ): Promise<string | null> {
    const buttons = new Array<RadioButton>();
    const equips = this.gisMapService
      .getGeoData()
      .equipments.filter((e) => e.nodeId === node.id)
      .sort((a, b) => b.type - a.type); // последним должен оказаться EmptyNode

    // если оборудования в узле нету и название узла не пустое, то нефиг спрашивать, применяем
    if (equips.length === 1 && node.title !== '') return equips[0].id;

    // последний не шлем, это EmtpyNode, вместо него будет написано Не использовать оборудование
    for (let i = 0; i < equips.length - 1; i++) {
      const equipment = equips[i];
      const button = {
        id: i,
        isSelected: equipmentId === null ? i === 0 : equipment.id === equipmentId,
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
      fromLandmarks: fromLandmarks,
      node,
      gisMapService: this.gisMapService,
      hasAnyBaseRef: hasAnyBaseRef,
      isLast: isLast
    };
    const dialogRef = this.dialog.open(TraceEquipmentSelectorComponent, dialogConfig);

    // и ждем здесь пока закроется диалог
    // вернет null если отказался от выбора (нажал Выход)
    const index = <number | null>await firstValueFrom(dialogRef.closed);
    if (index === null) return null;
    if (index === -1) return equips.at(-1)!.id; // выбран Не использовать оборудование, значит надо сохранить id от EmptyNode
    return equips[index].id;
  }
}
