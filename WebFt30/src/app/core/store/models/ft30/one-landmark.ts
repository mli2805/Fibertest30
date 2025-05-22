import { EquipmentType } from 'src/grpc-generated';

export class OneLandmark {
  public isFromBase!: boolean;
  public number!: number;
  public numberIncludingAdjustmentPoints!: number;
  public nodeId!: string;
  public fiberId!: string;
  public nodeTitle!: string;
  public nodeComment!: string;
  public equipmentId!: string;
  public equipmentTitle!: string;
  public equipmentType!: EquipmentType;
  public leftCableReserve!: number;
  public rightCableReserve!: number;
  public gpsDistance!: number;
  public gpsSection!: number;
  public isUserInput!: boolean;
  public opticalDistance!: number;
  public opticalSection!: number;
  public eventNumber!: number;
  public gpsCoors!: L.LatLng;

  public isSelected = false;

  public get UserInputLength() {
    return this.isUserInput ? this.gpsSection * 1000 : 0;
  }

  public set UserInputLength(value: number) {
    if (value === 0) {
      this.isUserInput = false;
      this.gpsSection = -1;
    } else {
      this.isUserInput = true;
      this.gpsSection = value / 1000;
    }
  }

  public clone(): OneLandmark {
    const clone = new OneLandmark();
    Object.assign(clone, this);
    return clone;
  }

  public cableReserveString(): string {
    if (this.equipmentType === EquipmentType.CableReserve) return this.leftCableReserve.toString();

    if (
      this.equipmentType === EquipmentType.Closure ||
      this.equipmentType === EquipmentType.Cross ||
      this.equipmentType === EquipmentType.Other ||
      this.equipmentType === EquipmentType.Terminal
    )
      return `${this.leftCableReserve} / ${this.rightCableReserve}`;

    return '';
  }

  public isEquipmentLandmark(): boolean {
    return (
      this.equipmentType === EquipmentType.Rtu ||
      this.equipmentType === EquipmentType.CableReserve ||
      this.equipmentType === EquipmentType.Closure ||
      this.equipmentType === EquipmentType.Cross ||
      this.equipmentType === EquipmentType.Other ||
      this.equipmentType === EquipmentType.Terminal
    );
  }

  public eventNumberString(): string {
    if (this.eventNumber === -1) return 'i18n.ft.no';
    return this.eventNumber.toString();
  }

  public canChangeEquipment(): boolean {
    return (
      this.equipmentType !== EquipmentType.Rtu && this.equipmentType !== EquipmentType.EmptyNode
    );
  }

  public nodePropertiesChanged(other: OneLandmark): boolean {
    return (
      this.nodeTitle != other.nodeTitle ||
      this.nodeComment != other.nodeComment ||
      this.gpsCoors.equals(other.gpsCoors)
    );
  }

  public equipmentPropertiesChanged(other: OneLandmark): boolean {
    return (
      this.equipmentTitle != other.equipmentTitle ||
      this.equipmentType != other.equipmentType ||
      this.leftCableReserve != other.leftCableReserve ||
      this.rightCableReserve != other.rightCableReserve
    );
  }
}
