import { EquipmentType } from 'src/grpc-generated';
import { GisMapUtils } from '../shared/gis-map.utils';
import { AddEquipmentAtGpsLocation, AddFiber, AddFiberWithNodes } from './graph-commands';
import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';

export class FiberCommandsFactory {
  static createFiberWithNodesCommand(
    node1: TraceNode,
    node2: TraceNode,
    quantity: number,
    type: EquipmentType
  ): AddFiberWithNodes {
    const intermediateNodes = this.createIntermediateNodes(
      node1.coors,
      node2.coors,
      quantity,
      type
    );
    const nodeIds = [node1.id, ...intermediateNodes.map((n) => n.NodeId), node2.id];

    const intermediateFibers = [];
    for (let i = 1; i < nodeIds.length; i++) {
      const cmd = new AddFiber(crypto.randomUUID(), nodeIds[i - 1], nodeIds[i]);
      intermediateFibers.push(cmd);
    }

    return new AddFiberWithNodes(node1.id, node2.id, intermediateNodes, intermediateFibers);
  }

  static createIntermediateNodes(
    startCoors: L.LatLng,
    finishCoors: L.LatLng,
    quantity: number,
    type: EquipmentType
  ): AddEquipmentAtGpsLocation[] {
    const deltaLat = (finishCoors.lat - startCoors.lat) / (quantity + 1);
    const deltaLng = (finishCoors.lng - startCoors.lng) / (quantity + 1);

    const result = [];
    for (let i = 0; i < quantity; i++) {
      const lat = startCoors.lat + deltaLat * (i + 1);
      const lng = startCoors.lng + deltaLng * (i + 1);

      const cmd = new AddEquipmentAtGpsLocation(
        type <= EquipmentType.EmptyNode ? GisMapUtils.emptyGuid : crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        type,
        lat,
        lng
      );

      result.push(cmd);
    }

    return result;
  }
}
