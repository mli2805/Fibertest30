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

  static toGrpcColoredLandmark(landmark: ColoredLandmark): grpc.ColoredLandmark {
    return {
      isFromBase: landmark.isFromBase,
      nodeId: landmark.nodeId,
      fiberId: landmark.fiberId,
      number: landmark.number,
      numberIncludingAdjustmentPoints: landmark.numberIncludingAdjustmentPoints,
      nodeTitle: landmark.nodeTitle,
      nodeTitleColor: landmark.nodeTitleColor,
      nodeComment: landmark.nodeComment,
      nodeCommentColor: landmark.nodeCommentColor,
      equipmentId: landmark.equipmentId,
      equipmentTitle: landmark.equipmentTitle,
      equipmentTitleColor: landmark.equipmentTitleColor,
      equipmentType: landmark.equipmentType,
      equipmentTypeColor: landmark.equipmentTypeColor,
      leftCableReserve: landmark.leftCableReserve,
      rightCableReserve: landmark.rightCableReserve,
      cableReservesColor: landmark.cableReservesColor,
      gpsDistance: landmark.gpsDistance,
      gpsSection: landmark.gpsSection,
      isUserInput: landmark.isUserInput,
      gpsSectionColor: landmark.gpsSectionColor,
      opticalDistance: landmark.opticalDistance,
      opticalSection: landmark.opticalSection,
      eventNumber: landmark.eventNumber,
      gpsCoors: GisMapping.toGeoCoordinate(landmark.gpsCoors!),
      gpsCoorsColor: landmark.gpsCoorsColor
    };
  }
}
