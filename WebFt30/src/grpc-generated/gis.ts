// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "gis.proto" (package "fibertest30.gis", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { EquipmentType } from "./ft.enums";
import { FiberState } from "./ft.enums";
/**
 * if dictionary is empty - fiber is not in trace (NotInTrace)
 *
 * @generated from protobuf message fibertest30.gis.FiberStateDictionaryItem
 */
export interface FiberStateDictionaryItem {
    /**
     * @generated from protobuf field: string traceId = 1;
     */
    traceId: string; // key
    /**
     * @generated from protobuf field: fibertest30.ft.enums.FiberState traceState = 2;
     */
    traceState: FiberState; // value
}
/**
 * @generated from protobuf message fibertest30.gis.GeoCoordinate
 */
export interface GeoCoordinate {
    /**
     * @generated from protobuf field: double latitude = 1;
     */
    latitude: number;
    /**
     * @generated from protobuf field: double longitude = 2;
     */
    longitude: number;
}
/**
 * @generated from protobuf message fibertest30.gis.TraceNode
 */
export interface TraceNode {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: string title = 2;
     */
    title: string;
    /**
     * @generated from protobuf field: fibertest30.gis.GeoCoordinate coors = 3;
     */
    coors?: GeoCoordinate;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.EquipmentType equipmentType = 4;
     */
    equipmentType: EquipmentType;
    /**
     * @generated from protobuf field: string comment = 5;
     */
    comment: string;
    /**
     * @generated from protobuf field: optional fibertest30.ft.enums.FiberState state = 6;
     */
    state?: FiberState;
    /**
     * @generated from protobuf field: optional string accidentOnTraceId = 7;
     */
    accidentOnTraceId?: string;
}
/**
 * @generated from protobuf message fibertest30.gis.GeoEquipment
 */
export interface GeoEquipment {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: string nodeId = 2;
     */
    nodeId: string;
    /**
     * @generated from protobuf field: string title = 3;
     */
    title: string;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.EquipmentType type = 4;
     */
    type: EquipmentType;
    /**
     * @generated from protobuf field: int32 cableReserveLeft = 5;
     */
    cableReserveLeft: number;
    /**
     * @generated from protobuf field: int32 cableReserveRight = 6;
     */
    cableReserveRight: number;
    /**
     * @generated from protobuf field: string comment = 7;
     */
    comment: string;
}
/**
 * @generated from protobuf message fibertest30.gis.GeoFiber
 */
export interface GeoFiber {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: string node1id = 2 [json_name = "node1id"];
     */
    node1Id: string;
    /**
     * @generated from protobuf field: fibertest30.gis.GeoCoordinate coors1 = 3;
     */
    coors1?: GeoCoordinate;
    /**
     * @generated from protobuf field: string node2id = 4 [json_name = "node2id"];
     */
    node2Id: string;
    /**
     * @generated from protobuf field: fibertest30.gis.GeoCoordinate coors2 = 5;
     */
    coors2?: GeoCoordinate;
    /**
     * @generated from protobuf field: repeated fibertest30.gis.FiberStateDictionaryItem states = 7;
     */
    states: FiberStateDictionaryItem[];
    /**
     * @generated from protobuf field: repeated fibertest30.gis.FiberStateDictionaryItem tracesWithExceededLossCoeff = 8;
     */
    tracesWithExceededLossCoeff: FiberStateDictionaryItem[];
}
/**
 * @generated from protobuf message fibertest30.gis.OpticalLength
 */
export interface OpticalLength {
    /**
     * @generated from protobuf field: string traceId = 1;
     */
    traceId: string;
    /**
     * @generated from protobuf field: double length = 2;
     */
    length: number;
}
/**
 * @generated from protobuf message fibertest30.gis.FiberInfo
 */
export interface FiberInfo {
    /**
     * @generated from protobuf field: string fiberId = 1;
     */
    fiberId: string;
    /**
     * @generated from protobuf field: string leftNodeTitle = 2;
     */
    leftNodeTitle: string;
    /**
     * @generated from protobuf field: string rightNodeTitle = 3;
     */
    rightNodeTitle: string;
    /**
     * @generated from protobuf field: double gpsLength = 4;
     */
    gpsLength: number;
    /**
     * @generated from protobuf field: double userInputedLength = 5;
     */
    userInputedLength: number;
    /**
     * @generated from protobuf field: repeated fibertest30.gis.OpticalLength tracesThrough = 6;
     */
    tracesThrough: OpticalLength[];
    /**
     * @generated from protobuf field: bool hasTraceUnderMonitoring = 7;
     */
    hasTraceUnderMonitoring: boolean;
}
/**
 * @generated from protobuf message fibertest30.gis.GeoTrace
 */
export interface GeoTrace {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: string title = 2;
     */
    title: string;
    /**
     * @generated from protobuf field: repeated string nodeIds = 3;
     */
    nodeIds: string[];
    /**
     * @generated from protobuf field: repeated string equipmentIds = 4;
     */
    equipmentIds: string[];
    /**
     * @generated from protobuf field: repeated string fiberIds = 5;
     */
    fiberIds: string[];
    /**
     * @generated from protobuf field: bool hasAnyBaseRef = 6;
     */
    hasAnyBaseRef: boolean;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.FiberState state = 7;
     */
    state: FiberState;
    /**
     * @generated from protobuf field: bool darkMode = 8;
     */
    darkMode: boolean;
    /**
     * @generated from protobuf field: string comment = 9;
     */
    comment: string;
}
/**
 * @generated from protobuf message fibertest30.gis.AllGeoData
 */
export interface AllGeoData {
    /**
     * @generated from protobuf field: repeated fibertest30.gis.GeoFiber fibers = 1;
     */
    fibers: GeoFiber[];
    /**
     * @generated from protobuf field: repeated fibertest30.gis.TraceNode nodes = 2;
     */
    nodes: TraceNode[];
    /**
     * @generated from protobuf field: repeated fibertest30.gis.GeoTrace traces = 3;
     */
    traces: GeoTrace[];
    /**
     * @generated from protobuf field: repeated fibertest30.gis.GeoEquipment equipments = 4;
     */
    equipments: GeoEquipment[];
}
/**
 * GetAllGeoData
 *
 * @generated from protobuf message fibertest30.gis.GetAllGeoDataRequest
 */
export interface GetAllGeoDataRequest {
}
/**
 * @generated from protobuf message fibertest30.gis.GetAllGeoDataResponse
 */
export interface GetAllGeoDataResponse {
    /**
     * @generated from protobuf field: fibertest30.gis.AllGeoData data = 1;
     */
    data?: AllGeoData;
}
/**
 * GetFiberInfo
 *
 * @generated from protobuf message fibertest30.gis.GetFiberInfoRequest
 */
export interface GetFiberInfoRequest {
    /**
     * @generated from protobuf field: string fiberId = 1;
     */
    fiberId: string;
}
/**
 * @generated from protobuf message fibertest30.gis.GetFiberInfoResponse
 */
export interface GetFiberInfoResponse {
    /**
     * @generated from protobuf field: fibertest30.gis.FiberInfo fiberInfo = 1;
     */
    fiberInfo?: FiberInfo;
}
// @generated message type with reflection information, may provide speed optimized methods
class FiberStateDictionaryItem$Type extends MessageType<FiberStateDictionaryItem> {
    constructor() {
        super("fibertest30.gis.FiberStateDictionaryItem", [
            { no: 1, name: "traceId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "traceState", kind: "enum", T: () => ["fibertest30.ft.enums.FiberState", FiberState] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.FiberStateDictionaryItem
 */
export const FiberStateDictionaryItem = new FiberStateDictionaryItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GeoCoordinate$Type extends MessageType<GeoCoordinate> {
    constructor() {
        super("fibertest30.gis.GeoCoordinate", [
            { no: 1, name: "latitude", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "longitude", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GeoCoordinate
 */
export const GeoCoordinate = new GeoCoordinate$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TraceNode$Type extends MessageType<TraceNode> {
    constructor() {
        super("fibertest30.gis.TraceNode", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "coors", kind: "message", T: () => GeoCoordinate },
            { no: 4, name: "equipmentType", kind: "enum", T: () => ["fibertest30.ft.enums.EquipmentType", EquipmentType] },
            { no: 5, name: "comment", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "state", kind: "enum", opt: true, T: () => ["fibertest30.ft.enums.FiberState", FiberState] },
            { no: 7, name: "accidentOnTraceId", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.TraceNode
 */
export const TraceNode = new TraceNode$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GeoEquipment$Type extends MessageType<GeoEquipment> {
    constructor() {
        super("fibertest30.gis.GeoEquipment", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "nodeId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "type", kind: "enum", T: () => ["fibertest30.ft.enums.EquipmentType", EquipmentType] },
            { no: 5, name: "cableReserveLeft", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "cableReserveRight", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "comment", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GeoEquipment
 */
export const GeoEquipment = new GeoEquipment$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GeoFiber$Type extends MessageType<GeoFiber> {
    constructor() {
        super("fibertest30.gis.GeoFiber", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "node1id", kind: "scalar", jsonName: "node1id", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "coors1", kind: "message", T: () => GeoCoordinate },
            { no: 4, name: "node2id", kind: "scalar", jsonName: "node2id", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "coors2", kind: "message", T: () => GeoCoordinate },
            { no: 7, name: "states", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => FiberStateDictionaryItem },
            { no: 8, name: "tracesWithExceededLossCoeff", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => FiberStateDictionaryItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GeoFiber
 */
export const GeoFiber = new GeoFiber$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OpticalLength$Type extends MessageType<OpticalLength> {
    constructor() {
        super("fibertest30.gis.OpticalLength", [
            { no: 1, name: "traceId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "length", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.OpticalLength
 */
export const OpticalLength = new OpticalLength$Type();
// @generated message type with reflection information, may provide speed optimized methods
class FiberInfo$Type extends MessageType<FiberInfo> {
    constructor() {
        super("fibertest30.gis.FiberInfo", [
            { no: 1, name: "fiberId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "leftNodeTitle", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "rightNodeTitle", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "gpsLength", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 5, name: "userInputedLength", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 6, name: "tracesThrough", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => OpticalLength },
            { no: 7, name: "hasTraceUnderMonitoring", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.FiberInfo
 */
export const FiberInfo = new FiberInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GeoTrace$Type extends MessageType<GeoTrace> {
    constructor() {
        super("fibertest30.gis.GeoTrace", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "nodeIds", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "equipmentIds", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "fiberIds", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "hasAnyBaseRef", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 7, name: "state", kind: "enum", T: () => ["fibertest30.ft.enums.FiberState", FiberState] },
            { no: 8, name: "darkMode", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 9, name: "comment", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GeoTrace
 */
export const GeoTrace = new GeoTrace$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AllGeoData$Type extends MessageType<AllGeoData> {
    constructor() {
        super("fibertest30.gis.AllGeoData", [
            { no: 1, name: "fibers", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => GeoFiber },
            { no: 2, name: "nodes", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => TraceNode },
            { no: 3, name: "traces", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => GeoTrace },
            { no: 4, name: "equipments", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => GeoEquipment }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.AllGeoData
 */
export const AllGeoData = new AllGeoData$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetAllGeoDataRequest$Type extends MessageType<GetAllGeoDataRequest> {
    constructor() {
        super("fibertest30.gis.GetAllGeoDataRequest", []);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GetAllGeoDataRequest
 */
export const GetAllGeoDataRequest = new GetAllGeoDataRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetAllGeoDataResponse$Type extends MessageType<GetAllGeoDataResponse> {
    constructor() {
        super("fibertest30.gis.GetAllGeoDataResponse", [
            { no: 1, name: "data", kind: "message", T: () => AllGeoData }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GetAllGeoDataResponse
 */
export const GetAllGeoDataResponse = new GetAllGeoDataResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetFiberInfoRequest$Type extends MessageType<GetFiberInfoRequest> {
    constructor() {
        super("fibertest30.gis.GetFiberInfoRequest", [
            { no: 1, name: "fiberId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GetFiberInfoRequest
 */
export const GetFiberInfoRequest = new GetFiberInfoRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetFiberInfoResponse$Type extends MessageType<GetFiberInfoResponse> {
    constructor() {
        super("fibertest30.gis.GetFiberInfoResponse", [
            { no: 1, name: "fiberInfo", kind: "message", T: () => FiberInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.gis.GetFiberInfoResponse
 */
export const GetFiberInfoResponse = new GetFiberInfoResponse$Type();
/**
 * @generated ServiceType for protobuf service fibertest30.gis.Gis
 */
export const Gis = new ServiceType("fibertest30.gis.Gis", [
    { name: "GetAllGeoData", options: {}, I: GetAllGeoDataRequest, O: GetAllGeoDataResponse },
    { name: "GetFiberInfo", options: {}, I: GetFiberInfoRequest, O: GetFiberInfoResponse }
]);
