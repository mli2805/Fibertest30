import { EquipmentType } from 'src/grpc-generated';

export class LandmarksModel {
  landmarksModelId!: string;
  landmarks!: ColoredLandmark[];

  constructor(init?: Partial<LandmarksModel>) {
    Object.assign(this, init);
  }

  clone(): LandmarksModel {
    const clone = new LandmarksModel();
    clone.landmarksModelId = this.landmarksModelId;
    clone.landmarks = this.landmarks.map((l) => l.clone());
    return clone;
  }
}

export class ColoredLandmark {
  isFromBase!: boolean;

  nodeId!: string;
  fiberId!: string; // to the left
  number!: number;
  numberIncludingAdjustmentPoints!: number;

  nodeTitle!: string;
  nodeTitleColor!: string;

  nodeComment!: string;
  nodeCommentColor!: string;

  equipmentId!: string;
  equipmentTitle!: string;
  equipmentTitleColor!: string;
  equipmentType!: EquipmentType;
  equipmentTypeColor!: string;

  leftCableReserve!: number;
  rightCableReserve!: number;
  cableReservesColor!: string;

  gpsDistance!: number; // by GPS, ignore cable reserve
  gpsSection!: number;
  isUserInput!: boolean;
  gpsSectionColor!: string;

  opticalDistance!: number; // from sor
  opticalSection!: number;
  eventNumber!: number;

  gpsCoors!: L.LatLng;
  gpsCoorsColor!: string;

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

  public clone(): ColoredLandmark {
    const clone = new ColoredLandmark();
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

  public areNodePropertiesChanged(other: ColoredLandmark): boolean {
    return (
      this.nodeTitle !== other.nodeTitle ||
      this.nodeComment !== other.nodeComment ||
      !this.areGpsCoorsEqual(other.gpsCoors, 0.0000005)
    );
  }

  private areGpsCoorsEqual(otherGpsCoors: L.LatLng, tolerance: number): boolean {
    const equals =
      Math.abs(this.gpsCoors.lat - otherGpsCoors.lat) < tolerance &&
      Math.abs(this.gpsCoors.lng - otherGpsCoors.lng) < tolerance;
    return equals;
  }

  public areEquipmentPropertiesChanged(other: ColoredLandmark): boolean {
    return (
      this.equipmentTitle !== other.equipmentTitle ||
      this.equipmentType !== other.equipmentType ||
      this.leftCableReserve !== other.leftCableReserve ||
      this.rightCableReserve !== other.rightCableReserve
    );
  }

  public areAnyPropertyChanged(other: ColoredLandmark): boolean {
    return (
      this.areNodePropertiesChanged(other) ||
      this.areEquipmentPropertiesChanged(other) ||
      this.UserInputLength !== other.UserInputLength
    );
  }
}
