import { TraceNode } from 'src/app/core/store/models/ft30/geo-data';

export class StepModel {
  nodeId!: string;
  title!: string;
  equipmentId!: string;
  fiberIds: string[] = [];
}

export class Neighbour {
  node!: TraceNode;
  fiberIds: string[] = [];
}
