import * as grpc from 'src/grpc-generated';
import {
  BranchOfAcceptableMeasParams,
  DistanceMeasParam,
  LeafOfAcceptableMeasParams,
  TreeOfAcceptableMeasurementParameters,
  UnitMeasParam
} from '../models/ft30/acceptable-measurement-parameters';

export class AcceptableParamsMapping {
  static fromGrpcLeaf(grpcLeaf: grpc.LeafOfAcceptableMeasParams): LeafOfAcceptableMeasParams {
    const leaf = new LeafOfAcceptableMeasParams();
    leaf.resolutions = grpcLeaf.resolutions.map((r) => r);
    leaf.pulseDurations = grpcLeaf.pulseDurations.map((p) => p);
    leaf.periodsToAverage = grpcLeaf.periodsToAverage.map((p) => p);
    leaf.measCountsToAverage = grpcLeaf.measCountsToAverage.map((m) => m);
    return leaf;
  }

  static fromGrpcDistance(grpcDistance: grpc.DistanceMeasParam): DistanceMeasParam {
    const distance = new DistanceMeasParam();
    distance.distance = grpcDistance.distance;
    distance.otherParams = grpcDistance.otherParams!;
    return distance;
  }

  static fromGrpcBranch(
    grpcBranch: grpc.BranchOfAcceptableMeasParams
  ): BranchOfAcceptableMeasParams {
    const branch = new BranchOfAcceptableMeasParams();
    branch.distances = grpcBranch.distances.map((d) => this.fromGrpcDistance(d));
    branch.backscatterCoeff = grpcBranch.backscatterCoeff;
    branch.refractiveIndex = grpcBranch.refractiveIndex;
    return branch;
  }

  static fromGrpcUnit(grpcUnit: grpc.UnitMeasParam): UnitMeasParam {
    const unit = new UnitMeasParam();
    unit.unit = grpcUnit.unit;
    unit.branch = this.fromGrpcBranch(grpcUnit.branch!);
    return unit;
  }

  static fromGrpcAcceptableParams(
    grpcAcceptableParams: grpc.TreeOfAcceptableMeasParams
  ): TreeOfAcceptableMeasurementParameters {
    const tree = new TreeOfAcceptableMeasurementParameters();
    tree.units = grpcAcceptableParams.units.map((u) => this.fromGrpcUnit(u));
    return tree;
  }
}
