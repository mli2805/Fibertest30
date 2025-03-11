import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';

export class StepModel {
  nodeId!: string;
  title!: string; // узел + оборудование
  equipmentId!: string; // Guid.Empty если без оборудования в этом узле
  fiberIds: string[] = [];
}

export class Neighbour {
  node!: TraceNode;
  fiberIds: string[] = [];
  previous = false;
}
