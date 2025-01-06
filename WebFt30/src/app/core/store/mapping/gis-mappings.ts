import * as grpc from 'src/grpc-generated';
import { GraphRoutesData, TraceNode, TraceRouteData } from '../models/ft30/graph-data';

export class GisMapping {
  static fromTraceNode(grpcTraceNode: grpc.TraceNode): TraceNode {
    const node = new TraceNode(
      grpcTraceNode.id,
      grpcTraceNode.title,
      grpcTraceNode.coors!,
      grpcTraceNode.equipmentType
    );
    return node;
  }

  static fromTraceRouteData(grpcTraceRoute: grpc.TraceRouteData): TraceRouteData {
    const nodes = grpcTraceRoute.nodes.map((n) => this.fromTraceNode(n));
    const route = new TraceRouteData(nodes, grpcTraceRoute.traceState);
    return route;
  }

  static fromGrpcGraphRoutesData(grpcGraphRoutesData: grpc.GraphRoutesData): GraphRoutesData {
    const routes = grpcGraphRoutesData.traces.map((t) => this.fromTraceRouteData(t));
    return new GraphRoutesData(routes);
  }
}
