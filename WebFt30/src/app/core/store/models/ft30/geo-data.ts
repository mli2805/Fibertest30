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
    public comment: string
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
    public states: FiberStateItem[]
  ) {}

  public getState(): FiberState {
    if (this.states.length === 0) return FiberState.NotInTrace;

    const state = Math.max(...this.states.map((e) => e.traceState));
    return state;
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

export class TraceRouteData {
  constructor(public traceId: string, public nodes: TraceNode[], public traceState: FiberState) {}
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
