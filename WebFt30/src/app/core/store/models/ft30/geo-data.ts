import { EquipmentType } from 'src/grpc-generated';
import { FiberState } from './ft-enums';

export class NodeDetour {
  constructor(
    public FiberId: string,
    public NodeId1: string,
    public NodeId2: string,
    public TraceState: FiberState,
    public TraceId: string
  ) {}
}

export class TraceNode {
  constructor(
    public id: string,
    public title: string,
    public coors: L.LatLng,
    public equipmentType: EquipmentType,
    public comment: string,
    public state: FiberState = FiberState.Ok,
    public accidentOnTraceId: string = ''
  ) {}

  setCoors(coors: L.LatLng) {
    this.coors = coors;
  }
}

export class GeoEquipment {
  constructor(
    public id: string,
    public title: string,
    public nodeId: string,
    public type: EquipmentType,
    public cableReserveLeft: number,
    public cableReserveRight: number,
    public comment: string
  ) {}
}

export class FiberStateItem {
  constructor(public traceId: string, public traceState: FiberState) {}
}

export class GeoFiber {
  constructor(
    public id: string,
    public node1id: string,
    public coors1: L.LatLng,
    public node2id: string,
    public coors2: L.LatLng,
    // состояния трасс, проходящих через участок
    // трасса может проходить через участок несколько раз
    public states: FiberStateItem[],
    public tracesWithExceededLossCoeff: FiberStateItem[] = []
  ) {}

  public getState(): FiberState {
    if (this.states.length === 0) return FiberState.NotInTrace;

    const state = Math.max(...this.states.map((e) => e.traceState));
    return state;
  }
}

export class OpticalLength {
  constructor(public traceId: string, public length: number) {}
}

export class FiberInfo {
  constructor(
    public fiberId: string,
    public leftNodeTitle: string,
    public rightNodeTitle: string,
    public gpsLength: number,
    public userInputedLength: number,
    public tracesThrough: OpticalLength[],
    public hasTraceUnderMonitoring: boolean
  ) {}
}

export class OneLandmark {
  constructor(
    public isFromBase: boolean,
    public number: number,
    public numberIncludingAdjustmentPoints: number,
    public nodeId: string,
    public fiberId: string,
    public nodeTitle: string,
    public nodeComment: string,
    public equipmentId: string,
    public equipmentTitle: string,
    public equipmentType: EquipmentType,
    public leftCableReserve: number,
    public rightCableReserve: number,
    public gpsDistance: number,
    public gpsSection: number,
    public isUserInput: boolean,
    public opticalDistance: number,
    public opticalSection: number,
    public eventNumber: number,
    public gpsCoors: L.LatLng
  ) {}

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

  public eventNumberString(): string {
    if (this.eventNumber === -1) return 'i18n.ft.no';
    return this.eventNumber.toString();
  }
}

export class GeoTrace {
  constructor(
    public id: string,
    public title: string,
    public nodeIds: string[],
    public equipmentIds: string[],
    public fiberIds: string[],
    public hasAnyBaseRef: boolean,
    public state: FiberState,
    public darkMode: boolean,
    public comment: string
  ) {}
}

// узлы и участки для карты root'а
export class AllGeoData {
  constructor(
    public fibers: GeoFiber[],
    public nodes: TraceNode[],
    public traces: GeoTrace[],
    public equipments: GeoEquipment[] // засунул сюда и RTU чтобы искать также по nodeId
  ) {}
}
