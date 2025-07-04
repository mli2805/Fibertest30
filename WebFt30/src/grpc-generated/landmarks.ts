// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "landmarks.proto" (package "fibertest30.landmarks", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { EquipmentType } from "./ft.enums";
import { GeoCoordinate } from "./gis";
/**
 * @generated from protobuf message fibertest30.landmarks.ColoredLandmark
 */
export interface ColoredLandmark {
    /**
     * @generated from protobuf field: string nodeId = 1;
     */
    nodeId: string;
    /**
     * @generated from protobuf field: string fiberId = 2;
     */
    fiberId: string;
    /**
     * @generated from protobuf field: int32 number = 3;
     */
    number: number;
    /**
     * @generated from protobuf field: int32 numberIncludingAdjustmentPoints = 4;
     */
    numberIncludingAdjustmentPoints: number;
    /**
     * @generated from protobuf field: string nodeTitle = 5;
     */
    nodeTitle: string;
    /**
     * @generated from protobuf field: string nodeTitleColor = 6;
     */
    nodeTitleColor: string;
    /**
     * @generated from protobuf field: string nodeComment = 7;
     */
    nodeComment: string;
    /**
     * @generated from protobuf field: string nodeCommentColor = 8;
     */
    nodeCommentColor: string;
    /**
     * @generated from protobuf field: string equipmentId = 9;
     */
    equipmentId: string;
    /**
     * @generated from protobuf field: string equipmentTitle = 10;
     */
    equipmentTitle: string;
    /**
     * @generated from protobuf field: string equipmentTitleColor = 11;
     */
    equipmentTitleColor: string;
    /**
     * @generated from protobuf field: int32 leftCableReserve = 12;
     */
    leftCableReserve: number;
    /**
     * @generated from protobuf field: int32 rightCableReserve = 13;
     */
    rightCableReserve: number;
    /**
     * @generated from protobuf field: string cableReservesColor = 14;
     */
    cableReservesColor: string;
    /**
     * @generated from protobuf field: double gpsDistance = 15;
     */
    gpsDistance: number;
    /**
     * @generated from protobuf field: double gpsSection = 16;
     */
    gpsSection: number;
    /**
     * @generated from protobuf field: bool isUserInput = 17;
     */
    isUserInput: boolean;
    /**
     * @generated from protobuf field: string gpsSectionColor = 18;
     */
    gpsSectionColor: string;
    /**
     * @generated from protobuf field: double opticalDistance = 19;
     */
    opticalDistance: number;
    /**
     * @generated from protobuf field: double opticalSection = 20;
     */
    opticalSection: number;
    /**
     * @generated from protobuf field: int32 eventNumber = 21;
     */
    eventNumber: number;
    /**
     * @generated from protobuf field: fibertest30.gis.GeoCoordinate gpsCoors = 22;
     */
    gpsCoors?: GeoCoordinate;
    /**
     * @generated from protobuf field: string gpsCoorsColor = 23;
     */
    gpsCoorsColor: string;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.EquipmentType equipmentType = 24;
     */
    equipmentType: EquipmentType;
    /**
     * @generated from protobuf field: string equipmentTypeColor = 25;
     */
    equipmentTypeColor: string;
    /**
     * @generated from protobuf field: bool isFromBase = 26;
     */
    isFromBase: boolean;
}
/**
 * @generated from protobuf message fibertest30.landmarks.LandmarksModel
 */
export interface LandmarksModel {
    /**
     * @generated from protobuf field: string landmarksModelId = 1;
     */
    landmarksModelId: string;
    /**
     * @generated from protobuf field: repeated fibertest30.landmarks.ColoredLandmark landmarks = 2;
     */
    landmarks: ColoredLandmark[];
}
/**
 * GetLandmarksModel
 *
 * @generated from protobuf message fibertest30.landmarks.GetLandmarksModelRequest
 */
export interface GetLandmarksModelRequest {
    /**
     * @generated from protobuf field: string landmarksModelId = 1;
     */
    landmarksModelId: string;
}
/**
 * @generated from protobuf message fibertest30.landmarks.GetLandmarksModelResponse
 */
export interface GetLandmarksModelResponse {
    /**
     * @generated from protobuf field: fibertest30.landmarks.LandmarksModel landmarksModel = 1;
     */
    landmarksModel?: LandmarksModel;
}
/**
 * CreateLandmarksModel
 *
 * @generated from protobuf message fibertest30.landmarks.CreateLandmarksModelRequest
 */
export interface CreateLandmarksModelRequest {
    /**
     * @generated from protobuf field: string landmarksModelId = 1;
     */
    landmarksModelId: string;
    /**
     * @generated from protobuf field: string traceId = 2;
     */
    traceId: string;
}
/**
 * @generated from protobuf message fibertest30.landmarks.CreateLandmarksModelResponse
 */
export interface CreateLandmarksModelResponse {
}
/**
 * UpdateLandmarksModel
 *
 * @generated from protobuf message fibertest30.landmarks.UpdateLandmarksModelRequest
 */
export interface UpdateLandmarksModelRequest {
    /**
     * @generated from protobuf field: string landmarksModelId = 1;
     */
    landmarksModelId: string;
    /**
     * @generated from protobuf field: optional fibertest30.landmarks.ColoredLandmark changedLandmark = 2;
     */
    changedLandmark?: ColoredLandmark;
    /**
     * @generated from protobuf field: optional bool isFilterOn = 3;
     */
    isFilterOn?: boolean;
}
/**
 * @generated from protobuf message fibertest30.landmarks.UpdateLandmarksModelResponse
 */
export interface UpdateLandmarksModelResponse {
}
/**
 * DeleteLandmarksModel
 *
 * @generated from protobuf message fibertest30.landmarks.DeleteLandmarksModelRequest
 */
export interface DeleteLandmarksModelRequest {
    /**
     * @generated from protobuf field: string landmarksModelId = 1;
     */
    landmarksModelId: string;
}
/**
 * @generated from protobuf message fibertest30.landmarks.DeleteLandmarksModelResponse
 */
export interface DeleteLandmarksModelResponse {
}
// @generated message type with reflection information, may provide speed optimized methods
class ColoredLandmark$Type extends MessageType<ColoredLandmark> {
    constructor() {
        super("fibertest30.landmarks.ColoredLandmark", [
            { no: 1, name: "nodeId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "fiberId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "number", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "numberIncludingAdjustmentPoints", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "nodeTitle", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "nodeTitleColor", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "nodeComment", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "nodeCommentColor", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "equipmentId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "equipmentTitle", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "equipmentTitleColor", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 12, name: "leftCableReserve", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 13, name: "rightCableReserve", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 14, name: "cableReservesColor", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "gpsDistance", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 16, name: "gpsSection", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 17, name: "isUserInput", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 18, name: "gpsSectionColor", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 19, name: "opticalDistance", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 20, name: "opticalSection", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 21, name: "eventNumber", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 22, name: "gpsCoors", kind: "message", T: () => GeoCoordinate },
            { no: 23, name: "gpsCoorsColor", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 24, name: "equipmentType", kind: "enum", T: () => ["fibertest30.ft.enums.EquipmentType", EquipmentType] },
            { no: 25, name: "equipmentTypeColor", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 26, name: "isFromBase", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.ColoredLandmark
 */
export const ColoredLandmark = new ColoredLandmark$Type();
// @generated message type with reflection information, may provide speed optimized methods
class LandmarksModel$Type extends MessageType<LandmarksModel> {
    constructor() {
        super("fibertest30.landmarks.LandmarksModel", [
            { no: 1, name: "landmarksModelId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "landmarks", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ColoredLandmark }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.LandmarksModel
 */
export const LandmarksModel = new LandmarksModel$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetLandmarksModelRequest$Type extends MessageType<GetLandmarksModelRequest> {
    constructor() {
        super("fibertest30.landmarks.GetLandmarksModelRequest", [
            { no: 1, name: "landmarksModelId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.GetLandmarksModelRequest
 */
export const GetLandmarksModelRequest = new GetLandmarksModelRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetLandmarksModelResponse$Type extends MessageType<GetLandmarksModelResponse> {
    constructor() {
        super("fibertest30.landmarks.GetLandmarksModelResponse", [
            { no: 1, name: "landmarksModel", kind: "message", T: () => LandmarksModel }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.GetLandmarksModelResponse
 */
export const GetLandmarksModelResponse = new GetLandmarksModelResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateLandmarksModelRequest$Type extends MessageType<CreateLandmarksModelRequest> {
    constructor() {
        super("fibertest30.landmarks.CreateLandmarksModelRequest", [
            { no: 1, name: "landmarksModelId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "traceId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.CreateLandmarksModelRequest
 */
export const CreateLandmarksModelRequest = new CreateLandmarksModelRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateLandmarksModelResponse$Type extends MessageType<CreateLandmarksModelResponse> {
    constructor() {
        super("fibertest30.landmarks.CreateLandmarksModelResponse", []);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.CreateLandmarksModelResponse
 */
export const CreateLandmarksModelResponse = new CreateLandmarksModelResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdateLandmarksModelRequest$Type extends MessageType<UpdateLandmarksModelRequest> {
    constructor() {
        super("fibertest30.landmarks.UpdateLandmarksModelRequest", [
            { no: 1, name: "landmarksModelId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "changedLandmark", kind: "message", T: () => ColoredLandmark },
            { no: 3, name: "isFilterOn", kind: "scalar", opt: true, T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.UpdateLandmarksModelRequest
 */
export const UpdateLandmarksModelRequest = new UpdateLandmarksModelRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdateLandmarksModelResponse$Type extends MessageType<UpdateLandmarksModelResponse> {
    constructor() {
        super("fibertest30.landmarks.UpdateLandmarksModelResponse", []);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.UpdateLandmarksModelResponse
 */
export const UpdateLandmarksModelResponse = new UpdateLandmarksModelResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteLandmarksModelRequest$Type extends MessageType<DeleteLandmarksModelRequest> {
    constructor() {
        super("fibertest30.landmarks.DeleteLandmarksModelRequest", [
            { no: 1, name: "landmarksModelId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.DeleteLandmarksModelRequest
 */
export const DeleteLandmarksModelRequest = new DeleteLandmarksModelRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteLandmarksModelResponse$Type extends MessageType<DeleteLandmarksModelResponse> {
    constructor() {
        super("fibertest30.landmarks.DeleteLandmarksModelResponse", []);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.landmarks.DeleteLandmarksModelResponse
 */
export const DeleteLandmarksModelResponse = new DeleteLandmarksModelResponse$Type();
/**
 * @generated ServiceType for protobuf service fibertest30.landmarks.Landmarks
 */
export const Landmarks = new ServiceType("fibertest30.landmarks.Landmarks", [
    { name: "GetLandmarksModel", options: {}, I: GetLandmarksModelRequest, O: GetLandmarksModelResponse },
    { name: "CreateLandmarksModel", options: {}, I: CreateLandmarksModelRequest, O: CreateLandmarksModelResponse },
    { name: "UpdateLandmarksModel", options: {}, I: UpdateLandmarksModelRequest, O: UpdateLandmarksModelResponse },
    { name: "DeleteLandmarksModel", options: {}, I: DeleteLandmarksModelRequest, O: DeleteLandmarksModelResponse }
]);
