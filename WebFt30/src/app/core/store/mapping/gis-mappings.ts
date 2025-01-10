import * as grpc from 'src/grpc-generated';
import {
  AllGeoData,
  GeoFiber,
  GraphRoutesData,
  TraceNode,
  TraceRouteData
} from '../models/ft30/geo-data';
import { FtEnumsMapping } from './ft-enums-mapping';

export class GisMapping {
  static fromTraceNode(grpcTraceNode: grpc.TraceNode): TraceNode {
    const node = new TraceNode(
      grpcTraceNode.id,
      grpcTraceNode.title,
      grpcTraceNode.coors!,
      grpcTraceNode.equipmentType,
      grpcTraceNode.fiberIds
    );
    return node;
  }

  static fromGeoFiber(grpcGeoFiber: grpc.GeoFiber): GeoFiber {
    const fiber = new GeoFiber(
      grpcGeoFiber.id,
      grpcGeoFiber.coors1!,
      grpcGeoFiber.coors2!,
      FtEnumsMapping.fromGrpcFiberState(grpcGeoFiber.fiberState)
    );
    return fiber;
  }

  static fromTraceRouteData(grpcTraceRoute: grpc.TraceRouteData): TraceRouteData {
    const nodes = grpcTraceRoute.nodes.map((n) => this.fromTraceNode(n));
    const route = new TraceRouteData(
      nodes,
      FtEnumsMapping.fromGrpcFiberState(grpcTraceRoute.traceState)
    );
    return route;
  }

  static fromGrpcGraphRoutesData(grpcGraphRoutesData: grpc.GraphRoutesData): GraphRoutesData {
    const routes = grpcGraphRoutesData.traces.map((t) => this.fromTraceRouteData(t));
    return new GraphRoutesData(routes);
  }

  static fromGrpcGeoData(grpcGeoData: grpc.AllGeoData): AllGeoData {
    const nodes = grpcGeoData.nodes.map((n) => this.fromTraceNode(n));
    const fibers = grpcGeoData.fibers.map((f) => this.fromGeoFiber(f));
    return new AllGeoData(fibers, nodes);
  }
}
