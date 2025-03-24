import * as grpc from 'src/grpc-generated';
import * as L from 'leaflet';
import {
  AllGeoData,
  FiberStateDictionaryItem,
  GeoEquipment,
  GeoFiber,
  GeoTrace,
  TraceNode,
  TraceRouteData
} from '../models/ft30/geo-data';
import { FtEnumsMapping } from './ft-enums-mapping';

export class GisMapping {
  static fromGeoCoordinate(coors: grpc.GeoCoordinate): L.LatLng {
    return new L.LatLng(coors.latitude, coors.longitude);
  }

  static fromTraceNode(grpcTraceNode: grpc.TraceNode): TraceNode {
    const node = new TraceNode(
      grpcTraceNode.id,
      grpcTraceNode.title,
      this.fromGeoCoordinate(grpcTraceNode.coors!),
      grpcTraceNode.equipmentType,
      grpcTraceNode.comment
    );
    return node;
  }

  static fromGeoEquipment(grpcGeoEquipment: grpc.GeoEquipment): GeoEquipment {
    const equipment = new GeoEquipment(
      grpcGeoEquipment.id,
      grpcGeoEquipment.title,
      grpcGeoEquipment.nodeId,
      grpcGeoEquipment.type,
      grpcGeoEquipment.cableReserveLeft,
      grpcGeoEquipment.cableReserveRight,
      grpcGeoEquipment.comment
    );
    return equipment;
  }

  static fromGeoFiber(grpcGeoFiber: grpc.GeoFiber): GeoFiber {
    const fiber = new GeoFiber(
      grpcGeoFiber.id,
      grpcGeoFiber.node1Id,
      this.fromGeoCoordinate(grpcGeoFiber.coors1!),
      grpcGeoFiber.node2Id,
      this.fromGeoCoordinate(grpcGeoFiber.coors2!),
      grpcGeoFiber.states.map(
        (s) =>
          new FiberStateDictionaryItem(s.traceId, FtEnumsMapping.fromGrpcFiberState(s.traceState))
      )
    );
    return fiber;
  }

  static fromGeoTrace(grpcGeoTrace: grpc.GeoTrace): GeoTrace {
    const trace = new GeoTrace(
      grpcGeoTrace.id,
      grpcGeoTrace.title,
      grpcGeoTrace.nodeIds.map((n) => n),
      grpcGeoTrace.equipmentIds.map((e) => e),
      grpcGeoTrace.fiberIds.map((f) => f),
      grpcGeoTrace.hasAnyBaseRef,
      FtEnumsMapping.fromGrpcFiberState(grpcGeoTrace.state),
      grpcGeoTrace.darkMode,
      grpcGeoTrace.comment
    );
    return trace;
  }

  static fromTraceRouteData(grpcTraceRoute: grpc.TraceRouteData): TraceRouteData {
    const nodes = grpcTraceRoute.nodes.map((n) => this.fromTraceNode(n));
    const route = new TraceRouteData(
      grpcTraceRoute.traceId,
      nodes,
      FtEnumsMapping.fromGrpcFiberState(grpcTraceRoute.traceState)
    );
    return route;
  }

  static fromGrpcGeoData(grpcGeoData: grpc.AllGeoData): AllGeoData {
    const nodes = grpcGeoData.nodes.map((n) => this.fromTraceNode(n));
    const fibers = grpcGeoData.fibers.map((f) => this.fromGeoFiber(f));
    const traces = grpcGeoData.traces.map((t) => this.fromGeoTrace(t));
    const equipments = grpcGeoData.equipments.map((e) => this.fromGeoEquipment(e));
    return new AllGeoData(fibers, nodes, traces, equipments);
  }
}
