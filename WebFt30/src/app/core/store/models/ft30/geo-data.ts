import { EquipmentType } from 'src/grpc-generated';
import { FiberState } from './ft-enums';

export class TraceNode {
  constructor(
    public id: string,
    public title: string,
    public coors: L.LatLng,
    public equipmentType: EquipmentType
  ) {}
}

export class GeoFiber {
  constructor(
    public id: string,
    public node1id: string,
    public coors1: L.LatLng,
    public node2id: string,
    public coors2: L.LatLng,
    public fiberState: FiberState
  ) {}
}

export class TraceRouteData {
  constructor(public traceId: string, public nodes: TraceNode[], public traceState: FiberState) {}
}

export class GraphRoutesData {
  constructor(public routes: TraceRouteData[]) {}
}

// узлы и участки для карты root'а
export class AllGeoData {
  constructor(public fibers: GeoFiber[], public nodes: TraceNode[]) {}
}
