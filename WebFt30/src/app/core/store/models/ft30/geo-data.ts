import { EquipmentType, GeoCoordinate } from 'src/grpc-generated';
import { FiberState } from './ft-enums';

export class TraceNode {
  constructor(
    public id: string,
    public title: string,
    public coors: GeoCoordinate,
    public equipmentType: EquipmentType
  ) {}
}

export class GeoFiber {
  constructor(
    public id: string,
    public coors1: GeoCoordinate,
    public coors2: GeoCoordinate,
    public fiberState: FiberState
  ) {}
}

export class TraceRouteData {
  constructor(public nodes: TraceNode[], public traceState: FiberState) {}
}

export class GraphRoutesData {
  constructor(public routes: TraceRouteData[]) {}
}

export class AllGeoData {
  constructor(public fibers: GeoFiber[], public nodes: TraceNode[]) {}
}
