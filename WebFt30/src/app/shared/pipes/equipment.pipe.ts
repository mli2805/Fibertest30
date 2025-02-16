import { Pipe, PipeTransform } from '@angular/core';
import { EquipmentType } from 'src/grpc-generated';

@Pipe({ name: 'equipmentPipe' })
export class EquipmentPipe implements PipeTransform {
  transform(equipmentType: EquipmentType) {
    switch (equipmentType) {
      case EquipmentType.Rtu:
        return 'RTU';
      case EquipmentType.Terminal:
        return 'i18n.ft.terminal';
      case EquipmentType.Cross:
        return 'i18n.ft.cross';
      case EquipmentType.Closure:
        return 'i18n.ft.closure';
      case EquipmentType.Other:
        return 'i18n.ft.other';
      case EquipmentType.CableReserve:
        return 'i18n.ft.cable-reserve';
    }
    return 'i18n.ft.unknown';
  }
}
