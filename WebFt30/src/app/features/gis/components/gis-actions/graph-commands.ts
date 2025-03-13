import { EquipmentType } from 'src/grpc-generated';

export class AddEquipmentAtGpsLocation {
  constructor(
    public EmptyNodeEquipmentId: string,
    public RequestedEquipmentId: string,
    public NodeId: string,
    public Type: EquipmentType,
    public Latitude: number,
    public Longitude: number
  ) {}
}

export class AddFiber {
  constructor(public FiberId: string, public NodeId1: string, public NodeId2: string) {}
}

export class AddFiberWithNodes {
  constructor(
    public Node1: string,
    public Node2: string,
    public AddEquipments: AddEquipmentAtGpsLocation[],
    public AddFibers: AddFiber[]
  ) {}
}
