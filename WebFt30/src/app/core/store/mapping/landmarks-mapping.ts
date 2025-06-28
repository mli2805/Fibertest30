import * as grpc from 'src/grpc-generated';
import { ColoredLandmark, LandmarksModel } from '../models/ft30/colored-landmark';
import { GisMapping } from './gis-mappings';
export class LandmarksMapping {
  static fromGrpcLandmarksModel(grpcLandmarkModel: grpc.LandmarksModel): LandmarksModel {
    const landmarkModel = new LandmarksModel();
    landmarkModel.landmarksModelId = grpcLandmarkModel.landmarksModelId;
    landmarkModel.landmarks = grpcLandmarkModel.landmarks.map((l) =>
      this.fromGrpcColoredLandmark(l)
    );
    return landmarkModel;
  }

  static fromGrpcColoredLandmark(grpcColoredLandmark: grpc.ColoredLandmark): ColoredLandmark {
    const coloredLandmark = new ColoredLandmark();

    coloredLandmark.isFromBase = grpcColoredLandmark.isFromBase;
    coloredLandmark.nodeId = grpcColoredLandmark.nodeId;
    coloredLandmark.fiberId = grpcColoredLandmark.fiberId;
    coloredLandmark.number = grpcColoredLandmark.number;
    coloredLandmark.numberIncludingAdjustmentPoints =
      grpcColoredLandmark.numberIncludingAdjustmentPoints;
    coloredLandmark.nodeTitle = grpcColoredLandmark.nodeTitle;
    coloredLandmark.nodeTitleColor = grpcColoredLandmark.nodeTitleColor;
    coloredLandmark.nodeComment = grpcColoredLandmark.nodeComment;
    coloredLandmark.nodeCommentColor = grpcColoredLandmark.nodeCommentColor;
    coloredLandmark.equipmentId = grpcColoredLandmark.equipmentId;
    coloredLandmark.equipmentTitle = grpcColoredLandmark.equipmentTitle;
    coloredLandmark.equipmentTitleColor = grpcColoredLandmark.equipmentTitleColor;
    coloredLandmark.equipmentType = grpcColoredLandmark.equipmentType;
    coloredLandmark.equipmentTypeColor = grpcColoredLandmark.equipmentTypeColor;
    coloredLandmark.leftCableReserve = grpcColoredLandmark.leftCableReserve;
    coloredLandmark.rightCableReserve = grpcColoredLandmark.rightCableReserve;
    coloredLandmark.cableReservesColor = grpcColoredLandmark.cableReservesColor;
    coloredLandmark.gpsDistance = grpcColoredLandmark.gpsDistance;
    coloredLandmark.gpsSection = grpcColoredLandmark.gpsSection;
    coloredLandmark.isUserInput = grpcColoredLandmark.isUserInput;
    coloredLandmark.gpsSectionColor = grpcColoredLandmark.gpsSectionColor;
    coloredLandmark.opticalDistance = grpcColoredLandmark.opticalDistance;
    coloredLandmark.opticalSection = grpcColoredLandmark.opticalSection;
    coloredLandmark.eventNumber = grpcColoredLandmark.eventNumber;
    coloredLandmark.gpsCoors = GisMapping.fromGeoCoordinate(grpcColoredLandmark.gpsCoors!);
    coloredLandmark.gpsCoorsColor = grpcColoredLandmark.gpsCoorsColor;
    coloredLandmark.isSelected = false;

    return coloredLandmark;
  }
}
