import { EquipmentType, FiberState, GeoCoordinate } from 'src/grpc-generated';

export class TraceNode {
  constructor(
    public id: string,
    public title: string,
    public coors: GeoCoordinate,
    public equipmentType: EquipmentType
  ) {}
}

export class TraceRouteData {
  constructor(public nodes: TraceNode[], public traceState: FiberState) {}
}

export class GraphRoutesData {
  constructor(public routes: TraceRouteData[]) {}
}
