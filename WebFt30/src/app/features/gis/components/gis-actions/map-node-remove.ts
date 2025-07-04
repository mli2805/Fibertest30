import { Injector } from '@angular/core';
import { GisMapService } from '../../gis-map.service';
import { GeoFiber, GeoTrace, NodeDetour, TraceNode } from 'src/app/core/store/models/ft30/geo-data';
import { GisMapUtils } from '../shared/gis-map.utils';
import { EquipmentType } from 'src/grpc-generated';
import { GisMapLayer } from '../shared/gis-map-layer';
import { MapLayersActions } from './map-layers-actions';
import { MapFiberMenu } from './map-fiber-menu';

export class MapNodeRemove {
  private static gisMapService: GisMapService;

  static initialize(injector: Injector) {
    this.gisMapService = injector.get(GisMapService);
  }

  static ExcludeAllNodeAppearancesInTrace(nodeId: string, trace: GeoTrace, detours: any[]) {
    let index = -1;
    while ((index = trace.nodeIds.indexOf(nodeId)) !== -1) {
      const detour = detours.find(
        (d) =>
          d.TraceId === trace.id &&
          d.NodeId1 === trace.nodeIds[index - 1] &&
          d.NodeId2 === trace.nodeIds[index + 1]
      )!;

      if (detour.NodeId1 === detour.NodeId2) {
        if (index === 1) index = 2;
        trace.nodeIds.splice(index - 1, 2);
        trace.fiberIds.splice(index - 1, 2);
      } else {
        const detourFiberId = this.CreateDetourFiberIfAbsent(detour);
        trace.nodeIds.splice(index, 1);
        trace.equipmentIds.splice(index, 1);

        trace.fiberIds.splice(index - 1, 2);
        trace.fiberIds.splice(index - 1, 0, detourFiberId); // это такая вставка по индексу
      }

      // console.log(trace.title);
      // for (let i = 0; i < trace.fiberIds.length; i++) {
      //   const element = trace.fiberIds[i];
      //   console.log(`${i}  ${element}`);
      // }
    }
  }

  static CreateDetourFiberIfAbsent(detour: NodeDetour): string {
    const fiber = this.gisMapService
      .getGeoData()
      .fibers.find(
        (f) =>
          (f.node1id === detour.NodeId1 && f.node2id === detour.NodeId2) ||
          (f.node1id === detour.NodeId2 && f.node2id === detour.NodeId1)
      );
    if (fiber === undefined) {
      const nodeBefore = this.gisMapService.getGeoData().nodes.find((n) => n.id === detour.NodeId1);
      const nodeAfter = this.gisMapService.getGeoData().nodes.find((n) => n.id === detour.NodeId2);
      const newFiber = new GeoFiber(
        detour.FiberId,
        detour.NodeId1,
        nodeBefore!.coors,
        detour.NodeId2,
        nodeAfter!.coors,
        [{ traceId: detour.TraceId, traceState: detour.TraceState }]
      );
      this.gisMapService.getGeoData().fibers.push(newFiber);
      MapLayersActions.addFiberToLayer(newFiber);
      return newFiber.id;
    } else {
      // уже другая трасса прошла по этому волокну
      // или эта же трасса туда сюда поэтому проверяем
      if (fiber.states.findIndex((s) => s.traceId === detour.TraceId) === -1) {
        fiber.states.push({ traceId: detour.TraceId, traceState: detour.TraceState });
      }
      return fiber.id; // возвращаем не fiberId из этого detour а того который уже использовали первым
    }
  }

  static ExcludeAdjustmentPoint(nodeId: string, fiberIdToDetourAdjustmentPoint: string) {
    const geoFibers = this.gisMapService.getGeoData().fibers;
    const geoNodes = this.gisMapService.getGeoData().nodes;

    const leftFiber = geoFibers.find((f) => f.node2id === nodeId);
    const leftNodeId = leftFiber!.node1id;
    const leftNode = geoNodes.find((n) => n.id === leftNodeId);
    const rightFiber = geoFibers.find((f) => f.node1id === nodeId);
    const rightNodeId = rightFiber!.node2id;
    const rightNode = geoNodes.find((n) => n.id === rightNodeId);

    const leftFiberIndex = geoFibers.indexOf(leftFiber!);
    geoFibers.splice(leftFiberIndex, 1);
    const rightFiberIndex = geoFibers.indexOf(rightFiber!);
    geoFibers.splice(rightFiberIndex, 1);

    const nodeIndex = geoNodes.findIndex((n) => n.id === nodeId);
    geoNodes.splice(nodeIndex, 1);

    const newFiber = new GeoFiber(
      fiberIdToDetourAdjustmentPoint,
      leftNodeId,
      leftNode!.coors,
      rightNodeId,
      rightNode!.coors,
      []
    );
    geoFibers.push(newFiber);

    MapLayersActions.addFiberToLayer(newFiber);

    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(EquipmentType.AdjustmentPoint);
    const group = this.gisMapService.getLayerGroups().get(layerType);
    const marker = group?.getLayers().find((m) => (<any>m).id === nodeId);
    group?.removeLayer(marker!);

    const routesGroup = this.gisMapService.getLayerGroups().get(GisMapLayer.Route);
    const leftRoute = routesGroup!.getLayers().find((r) => (<any>r).id === leftFiber!.id);
    routesGroup!.removeLayer(leftRoute!);
    const rightRoute = routesGroup!.getLayers().find((r) => (<any>r).id === rightFiber!.id);
    routesGroup!.removeLayer(rightRoute!);
  }

  static RemoveNodeWithAllHisFibersUptoRealNode(node: TraceNode) {
    const fibers = this.gisMapService.getGeoData().fibers;
    const hisFibers = fibers.filter((f) => f.node1id === node.id || f.node2id === node.id);

    for (let i = 0; i < hisFibers.length; i++) {
      let fiberForDeletion = hisFibers[i];
      let nodeForDeletionId = node.id;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const anotherNodeId =
          fiberForDeletion.node1id === nodeForDeletionId
            ? fiberForDeletion.node2id
            : fiberForDeletion.node1id;
        const anotherNode = this.gisMapService.getNode(anotherNodeId);

        MapFiberMenu.removeFiberFromMapAndGeoData(fiberForDeletion);

        if (anotherNode?.equipmentType !== EquipmentType.AdjustmentPoint) break;

        fiberForDeletion = fibers.find(
          (f) => f.node1id === anotherNodeId || f.node2id === anotherNodeId
        )!;
        this.removeNodeFromMapAndGeoData(anotherNode);
        nodeForDeletionId = anotherNode.id;
      }
    }

    this.removeNodeFromMapAndGeoData(node);
  }

  static RemoveNodeWithAllHisFibers(node: TraceNode) {
    const hisFibers = this.gisMapService
      .getGeoData()
      .fibers.filter((f) => f.node1id === node.id || f.node2id === node.id);
    hisFibers.forEach((f) => MapFiberMenu.removeFiberFromMapAndGeoData(f));

    this.removeNodeFromMapAndGeoData(node);
  }

  static removeNodeFromMapAndGeoData(node: TraceNode) {
    this.gisMapService.geoDataLoading.next(true);
    const layerType = GisMapUtils.equipmentTypeToGisMapLayer(node!.equipmentType);
    const group = this.gisMapService.getLayerGroups().get(layerType);
    const marker = group!.getLayers().find((m) => (<any>m).id === node.id);
    group?.removeLayer(marker!);

    const index = this.gisMapService.getGeoData().nodes.indexOf(node);
    this.gisMapService.getGeoData().nodes.splice(index, 1);
    this.gisMapService.geoDataLoading.next(false);
  }

  ///////////////////////////////////////////////////////////
  // это проверки можно ли удалять и подготовка команды удаления
  ///////////////////////////////////////////////////////////

  static isRemoveThisNodePermitted(nodeId: string, type: EquipmentType): boolean {
    const traces = this.gisMapService.getGeoData().traces;
    for (let i = 0; i < traces.length; i++) {
      const trace = traces[i];
      if (trace.nodeIds.at(-1) === nodeId) return false;
      if (
        type !== EquipmentType.AdjustmentPoint &&
        trace.nodeIds.indexOf(nodeId) !== -1 &&
        trace.hasAnyBaseRef
      )
        return false;
    }
    return true;
  }

  // нельзя удалять если это
  // - развилка, а 1 из соседей точка привязки
  // - разворот и сосед точка привязки
  static isPossibleToRemove(nodeId: string): boolean {
    const hasProblem =
      this.isForkWithAdjustmentPointsNearby(nodeId) ||
      this.isUturnWithAdjustmentPointsNearby(nodeId);

    if (!hasProblem) return true;

    alert('Remove adjustment point or add any node');
    return false;
  }

  static isUturnWithAdjustmentPointsNearby(nodeId: string): boolean {
    const traces = this.gisMapService.getGeoData().traces;
    for (let i = 0; i < traces.length; i++) {
      const t = traces[i];
      for (let i = 0; i < t.nodeIds.length - 1; i++) {
        if (t.nodeIds[i] !== nodeId) continue;
        if (
          t.nodeIds[i - 1] === t.nodeIds[i + 1] &&
          this.gisMapService.getGeoData().nodes.find((n) => n.id === t.nodeIds[i - 1])
            ?.equipmentType === EquipmentType.AdjustmentPoint
        )
          return true;
      }
    }

    return false;
  }

  static isForkWithAdjustmentPointsNearby(nodeId: string): boolean {
    const fibers = this.gisMapService
      .getGeoData()
      .fibers.filter((f) => f.node1id === nodeId || f.node2id === nodeId);
    if (fibers.length <= 2) return false;

    for (let i = 0; i < fibers.length; i++) {
      const f = fibers[i];
      const neighbourId = f.node1id === nodeId ? f.node2id : f.node1id;
      const node = this.gisMapService.getGeoData().nodes.find((n) => n.id === neighbourId);
      if (node?.equipmentType === EquipmentType.AdjustmentPoint) return true;
    }

    return false;
  }

  // может быть несколько, если проходит через узел несколько раз
  static buildDetoursForTrace(nodeId: string, trace: GeoTrace): NodeDetour[] {
    const result = [];
    for (let i = 0; i < trace.nodeIds.length; i++) {
      if (trace.nodeIds[i] !== nodeId) continue;
      const detour = new NodeDetour(
        crypto.randomUUID(),
        trace.nodeIds[i - 1],
        trace.nodeIds[i + 1],
        trace.state,
        trace.id
      );
      result.push(detour);
    }
    return result;
  }
}
