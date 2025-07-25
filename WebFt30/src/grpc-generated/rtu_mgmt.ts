// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "rtu_mgmt.proto" (package "fibertest30.rtu_mgmt", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { BaseRefType } from "./ft.enums";
import { RtuMaker } from "./ft.enums";
import { FiberState } from "./ft.enums";
import { PortOfOtau } from "./rtu_tree";
import { NetAddress } from "./rtu_tree";
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.DoubleAddress
 */
export interface DoubleAddress {
    /**
     * @generated from protobuf field: fibertest30.rtu_tree.NetAddress main = 1;
     */
    main?: NetAddress;
    /**
     * @generated from protobuf field: bool hasReserveAddress = 2;
     */
    hasReserveAddress: boolean;
    /**
     * @generated from protobuf field: fibertest30.rtu_tree.NetAddress reserve = 3;
     */
    reserve?: NetAddress;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.MeasParamByPosition
 */
export interface MeasParamByPosition {
    /**
     * @generated from protobuf field: int32 param = 1;
     */
    param: number;
    /**
     * @generated from protobuf field: int32 position = 2;
     */
    position: number;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.InitializeRtuDto
 */
export interface InitializeRtuDto {
    /**
     * @generated from protobuf field: string rtuId = 1;
     */
    rtuId: string;
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.DoubleAddress rtuAddresses = 2;
     */
    rtuAddresses?: DoubleAddress;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.RtuInitializedDto
 */
export interface RtuInitializedDto {
    /**
     * @generated from protobuf field: bool isInitialized = 1;
     */
    isInitialized: boolean;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.DoMeasurementClientDto
 */
export interface DoMeasurementClientDto {
    /**
     * @generated from protobuf field: string rtuId = 1;
     */
    rtuId: string;
    /**
     * @generated from protobuf field: repeated fibertest30.rtu_tree.PortOfOtau portOfOtau = 2;
     */
    portOfOtau: PortOfOtau[];
    /**
     * @generated from protobuf field: repeated fibertest30.rtu_mgmt.MeasParamByPosition measParamsByPosition = 3;
     */
    measParamsByPosition: MeasParamByPosition[];
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.DoPreciseMeasurementOutOfTurnDto
 */
export interface DoPreciseMeasurementOutOfTurnDto {
    /**
     * @generated from protobuf field: string rtuId = 1;
     */
    rtuId: string;
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.PortWithTraceDto port = 2;
     */
    port?: PortWithTraceDto;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.PortWithTraceDto
 */
export interface PortWithTraceDto {
    /**
     * @generated from protobuf field: string traceId = 1;
     */
    traceId: string;
    /**
     * @generated from protobuf field: fibertest30.rtu_tree.PortOfOtau portOfOtau = 2;
     */
    portOfOtau?: PortOfOtau;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.FiberState lastTraceState = 3;
     */
    lastTraceState: FiberState;
    /**
     * @generated from protobuf field: int32 lastRtuAccidentOnTrace = 4;
     */
    lastRtuAccidentOnTrace: number; // from ReturnCode
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.ApplyMonitoringSettingsDto
 */
export interface ApplyMonitoringSettingsDto {
    /**
     * @generated from protobuf field: string rtuId = 1;
     */
    rtuId: string;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.RtuMaker rtuMaker = 2;
     */
    rtuMaker: RtuMaker;
    /**
     * @generated from protobuf field: bool isMonitoringOn = 3;
     */
    isMonitoringOn: boolean;
    /**
     * @generated from protobuf field: int32 preciseMeas = 4;
     */
    preciseMeas: number; // in hours, 0 - permanently, 9999 never
    /**
     * @generated from protobuf field: int32 preciseSave = 5;
     */
    preciseSave: number;
    /**
     * @generated from protobuf field: int32 fastSave = 6;
     */
    fastSave: number;
    /**
     * @generated from protobuf field: repeated fibertest30.rtu_mgmt.PortWithTraceDto ports = 7;
     */
    ports: PortWithTraceDto[];
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.BaseRefFile
 */
export interface BaseRefFile {
    /**
     * @generated from protobuf field: fibertest30.ft.enums.BaseRefType baseRefType = 1;
     */
    baseRefType: BaseRefType;
    /**
     * @generated from protobuf field: optional bytes fileBytes = 2;
     */
    fileBytes?: Uint8Array;
    /**
     * @generated from protobuf field: bool isForDelete = 3;
     */
    isForDelete: boolean;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.AssignBaseRefsDto
 */
export interface AssignBaseRefsDto {
    /**
     * @generated from protobuf field: string rtuId = 1;
     */
    rtuId: string;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.RtuMaker rtuMaker = 2;
     */
    rtuMaker: RtuMaker;
    /**
     * @generated from protobuf field: string traceId = 3;
     */
    traceId: string;
    /**
     * @generated from protobuf field: optional fibertest30.rtu_tree.PortOfOtau portOfOtau = 4;
     */
    portOfOtau?: PortOfOtau;
    /**
     * @generated from protobuf field: repeated fibertest30.rtu_mgmt.BaseRefFile baseRefFiles = 5;
     */
    baseRefFiles: BaseRefFile[];
    /**
     * @generated from protobuf field: repeated int32 deleteSors = 6;
     */
    deleteSors: number[];
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.BaseRefsAssignedDto
 */
export interface BaseRefsAssignedDto {
    /**
     * @generated from protobuf field: int32 returnCode = 1;
     */
    returnCode: number;
    /**
     * @generated from protobuf field: fibertest30.ft.enums.BaseRefType baseRefType = 2;
     */
    baseRefType: BaseRefType;
    /**
     * @generated from protobuf field: int32 nodes = 3;
     */
    nodes: number;
    /**
     * @generated from protobuf field: int32 equipments = 4;
     */
    equipments: number;
    /**
     * @generated from protobuf field: int32 landmarks = 5;
     */
    landmarks: number;
    /**
     * @generated from protobuf field: optional string waveLength = 6;
     */
    waveLength?: string;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.RequestAnswer
 */
export interface RequestAnswer {
    /**
     * @generated from protobuf field: int32 returnCode = 1;
     */
    returnCode: number;
    /**
     * @generated from protobuf field: string errorMessage = 2;
     */
    errorMessage: string;
}
// ------------------------------------------------------------

/**
 * @generated from protobuf message fibertest30.rtu_mgmt.TestRtuConnectionRequest
 */
export interface TestRtuConnectionRequest {
    /**
     * not RtuId because it could be new address
     *
     * @generated from protobuf field: fibertest30.rtu_tree.NetAddress netAddress = 1;
     */
    netAddress?: NetAddress;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.TestRtuConnectionResponse
 */
export interface TestRtuConnectionResponse {
    /**
     * @generated from protobuf field: fibertest30.rtu_tree.NetAddress netAddress = 1;
     */
    netAddress?: NetAddress;
    /**
     * @generated from protobuf field: bool isConnectionSuccessful = 2;
     */
    isConnectionSuccessful: boolean;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.InitializeRtuRequest
 */
export interface InitializeRtuRequest {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.InitializeRtuDto dto = 1;
     */
    dto?: InitializeRtuDto;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.InitializeRtuResponse
 */
export interface InitializeRtuResponse {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.RtuInitializedDto dto = 1;
     */
    dto?: RtuInitializedDto;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.DoMeasurementClientRequest
 */
export interface DoMeasurementClientRequest {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.DoMeasurementClientDto dto = 1;
     */
    dto?: DoMeasurementClientDto;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.DoPreciseMeasurementOutOfTurnRequest
 */
export interface DoPreciseMeasurementOutOfTurnRequest {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.DoPreciseMeasurementOutOfTurnDto dto = 1;
     */
    dto?: DoPreciseMeasurementOutOfTurnDto;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.GetMeasurementClientSorRequest
 */
export interface GetMeasurementClientSorRequest {
    /**
     * @generated from protobuf field: string measurementClientId = 1;
     */
    measurementClientId: string;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.GetSorResponse
 */
export interface GetSorResponse {
    /**
     * @generated from protobuf field: bytes measurement = 1;
     */
    measurement: Uint8Array;
    /**
     *  there is no baseline in sor for measurementClient
     *
     * @generated from protobuf field: optional bytes baseline = 2;
     */
    baseline?: Uint8Array;
    /**
     * @generated from protobuf field: bytes file = 3;
     */
    file: Uint8Array;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.GetMeasurementSorRequest
 */
export interface GetMeasurementSorRequest {
    /**
     * @generated from protobuf field: int32 sorFileId = 1;
     */
    sorFileId: number;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.StopMonitoringRequest
 */
export interface StopMonitoringRequest {
    /**
     * @generated from protobuf field: string rtuId = 1;
     */
    rtuId: string;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.InterruptMeasurementRequest
 */
export interface InterruptMeasurementRequest {
    /**
     * @generated from protobuf field: string rtuId = 1;
     */
    rtuId: string;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.EmptyResponse
 */
export interface EmptyResponse {
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.ApplyMonitoringSettingsRequest
 */
export interface ApplyMonitoringSettingsRequest {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.ApplyMonitoringSettingsDto dto = 1;
     */
    dto?: ApplyMonitoringSettingsDto;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.ApplyMonitoringSettingsResponse
 */
export interface ApplyMonitoringSettingsResponse {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.RequestAnswer dto = 1;
     */
    dto?: RequestAnswer;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.AssignBaseRefsRequest
 */
export interface AssignBaseRefsRequest {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.AssignBaseRefsDto dto = 1;
     */
    dto?: AssignBaseRefsDto;
}
/**
 * @generated from protobuf message fibertest30.rtu_mgmt.AssignBaseRefsResponse
 */
export interface AssignBaseRefsResponse {
    /**
     * @generated from protobuf field: fibertest30.rtu_mgmt.BaseRefsAssignedDto dto = 1;
     */
    dto?: BaseRefsAssignedDto;
}
// @generated message type with reflection information, may provide speed optimized methods
class DoubleAddress$Type extends MessageType<DoubleAddress> {
    constructor() {
        super("fibertest30.rtu_mgmt.DoubleAddress", [
            { no: 1, name: "main", kind: "message", T: () => NetAddress },
            { no: 2, name: "hasReserveAddress", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "reserve", kind: "message", T: () => NetAddress }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.DoubleAddress
 */
export const DoubleAddress = new DoubleAddress$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MeasParamByPosition$Type extends MessageType<MeasParamByPosition> {
    constructor() {
        super("fibertest30.rtu_mgmt.MeasParamByPosition", [
            { no: 1, name: "param", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "position", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.MeasParamByPosition
 */
export const MeasParamByPosition = new MeasParamByPosition$Type();
// @generated message type with reflection information, may provide speed optimized methods
class InitializeRtuDto$Type extends MessageType<InitializeRtuDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.InitializeRtuDto", [
            { no: 1, name: "rtuId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "rtuAddresses", kind: "message", T: () => DoubleAddress }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.InitializeRtuDto
 */
export const InitializeRtuDto = new InitializeRtuDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RtuInitializedDto$Type extends MessageType<RtuInitializedDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.RtuInitializedDto", [
            { no: 1, name: "isInitialized", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.RtuInitializedDto
 */
export const RtuInitializedDto = new RtuInitializedDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DoMeasurementClientDto$Type extends MessageType<DoMeasurementClientDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.DoMeasurementClientDto", [
            { no: 1, name: "rtuId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "portOfOtau", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => PortOfOtau },
            { no: 3, name: "measParamsByPosition", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => MeasParamByPosition }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.DoMeasurementClientDto
 */
export const DoMeasurementClientDto = new DoMeasurementClientDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DoPreciseMeasurementOutOfTurnDto$Type extends MessageType<DoPreciseMeasurementOutOfTurnDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.DoPreciseMeasurementOutOfTurnDto", [
            { no: 1, name: "rtuId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "port", kind: "message", T: () => PortWithTraceDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.DoPreciseMeasurementOutOfTurnDto
 */
export const DoPreciseMeasurementOutOfTurnDto = new DoPreciseMeasurementOutOfTurnDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PortWithTraceDto$Type extends MessageType<PortWithTraceDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.PortWithTraceDto", [
            { no: 1, name: "traceId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "portOfOtau", kind: "message", T: () => PortOfOtau },
            { no: 3, name: "lastTraceState", kind: "enum", T: () => ["fibertest30.ft.enums.FiberState", FiberState] },
            { no: 4, name: "lastRtuAccidentOnTrace", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.PortWithTraceDto
 */
export const PortWithTraceDto = new PortWithTraceDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ApplyMonitoringSettingsDto$Type extends MessageType<ApplyMonitoringSettingsDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.ApplyMonitoringSettingsDto", [
            { no: 1, name: "rtuId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "rtuMaker", kind: "enum", T: () => ["fibertest30.ft.enums.RtuMaker", RtuMaker] },
            { no: 3, name: "isMonitoringOn", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "preciseMeas", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "preciseSave", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "fastSave", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "ports", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => PortWithTraceDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.ApplyMonitoringSettingsDto
 */
export const ApplyMonitoringSettingsDto = new ApplyMonitoringSettingsDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class BaseRefFile$Type extends MessageType<BaseRefFile> {
    constructor() {
        super("fibertest30.rtu_mgmt.BaseRefFile", [
            { no: 1, name: "baseRefType", kind: "enum", T: () => ["fibertest30.ft.enums.BaseRefType", BaseRefType] },
            { no: 2, name: "fileBytes", kind: "scalar", opt: true, T: 12 /*ScalarType.BYTES*/ },
            { no: 3, name: "isForDelete", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.BaseRefFile
 */
export const BaseRefFile = new BaseRefFile$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AssignBaseRefsDto$Type extends MessageType<AssignBaseRefsDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.AssignBaseRefsDto", [
            { no: 1, name: "rtuId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "rtuMaker", kind: "enum", T: () => ["fibertest30.ft.enums.RtuMaker", RtuMaker] },
            { no: 3, name: "traceId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "portOfOtau", kind: "message", T: () => PortOfOtau },
            { no: 5, name: "baseRefFiles", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => BaseRefFile },
            { no: 6, name: "deleteSors", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.AssignBaseRefsDto
 */
export const AssignBaseRefsDto = new AssignBaseRefsDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class BaseRefsAssignedDto$Type extends MessageType<BaseRefsAssignedDto> {
    constructor() {
        super("fibertest30.rtu_mgmt.BaseRefsAssignedDto", [
            { no: 1, name: "returnCode", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "baseRefType", kind: "enum", T: () => ["fibertest30.ft.enums.BaseRefType", BaseRefType] },
            { no: 3, name: "nodes", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "equipments", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "landmarks", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "waveLength", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.BaseRefsAssignedDto
 */
export const BaseRefsAssignedDto = new BaseRefsAssignedDto$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RequestAnswer$Type extends MessageType<RequestAnswer> {
    constructor() {
        super("fibertest30.rtu_mgmt.RequestAnswer", [
            { no: 1, name: "returnCode", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "errorMessage", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.RequestAnswer
 */
export const RequestAnswer = new RequestAnswer$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestRtuConnectionRequest$Type extends MessageType<TestRtuConnectionRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.TestRtuConnectionRequest", [
            { no: 1, name: "netAddress", kind: "message", T: () => NetAddress }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.TestRtuConnectionRequest
 */
export const TestRtuConnectionRequest = new TestRtuConnectionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestRtuConnectionResponse$Type extends MessageType<TestRtuConnectionResponse> {
    constructor() {
        super("fibertest30.rtu_mgmt.TestRtuConnectionResponse", [
            { no: 1, name: "netAddress", kind: "message", T: () => NetAddress },
            { no: 2, name: "isConnectionSuccessful", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.TestRtuConnectionResponse
 */
export const TestRtuConnectionResponse = new TestRtuConnectionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class InitializeRtuRequest$Type extends MessageType<InitializeRtuRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.InitializeRtuRequest", [
            { no: 1, name: "dto", kind: "message", T: () => InitializeRtuDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.InitializeRtuRequest
 */
export const InitializeRtuRequest = new InitializeRtuRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class InitializeRtuResponse$Type extends MessageType<InitializeRtuResponse> {
    constructor() {
        super("fibertest30.rtu_mgmt.InitializeRtuResponse", [
            { no: 1, name: "dto", kind: "message", T: () => RtuInitializedDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.InitializeRtuResponse
 */
export const InitializeRtuResponse = new InitializeRtuResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DoMeasurementClientRequest$Type extends MessageType<DoMeasurementClientRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.DoMeasurementClientRequest", [
            { no: 1, name: "dto", kind: "message", T: () => DoMeasurementClientDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.DoMeasurementClientRequest
 */
export const DoMeasurementClientRequest = new DoMeasurementClientRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DoPreciseMeasurementOutOfTurnRequest$Type extends MessageType<DoPreciseMeasurementOutOfTurnRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.DoPreciseMeasurementOutOfTurnRequest", [
            { no: 1, name: "dto", kind: "message", T: () => DoPreciseMeasurementOutOfTurnDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.DoPreciseMeasurementOutOfTurnRequest
 */
export const DoPreciseMeasurementOutOfTurnRequest = new DoPreciseMeasurementOutOfTurnRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetMeasurementClientSorRequest$Type extends MessageType<GetMeasurementClientSorRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.GetMeasurementClientSorRequest", [
            { no: 1, name: "measurementClientId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.GetMeasurementClientSorRequest
 */
export const GetMeasurementClientSorRequest = new GetMeasurementClientSorRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSorResponse$Type extends MessageType<GetSorResponse> {
    constructor() {
        super("fibertest30.rtu_mgmt.GetSorResponse", [
            { no: 1, name: "measurement", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 2, name: "baseline", kind: "scalar", opt: true, T: 12 /*ScalarType.BYTES*/ },
            { no: 3, name: "file", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.GetSorResponse
 */
export const GetSorResponse = new GetSorResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetMeasurementSorRequest$Type extends MessageType<GetMeasurementSorRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.GetMeasurementSorRequest", [
            { no: 1, name: "sorFileId", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.GetMeasurementSorRequest
 */
export const GetMeasurementSorRequest = new GetMeasurementSorRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class StopMonitoringRequest$Type extends MessageType<StopMonitoringRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.StopMonitoringRequest", [
            { no: 1, name: "rtuId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.StopMonitoringRequest
 */
export const StopMonitoringRequest = new StopMonitoringRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class InterruptMeasurementRequest$Type extends MessageType<InterruptMeasurementRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.InterruptMeasurementRequest", [
            { no: 1, name: "rtuId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.InterruptMeasurementRequest
 */
export const InterruptMeasurementRequest = new InterruptMeasurementRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class EmptyResponse$Type extends MessageType<EmptyResponse> {
    constructor() {
        super("fibertest30.rtu_mgmt.EmptyResponse", []);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.EmptyResponse
 */
export const EmptyResponse = new EmptyResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ApplyMonitoringSettingsRequest$Type extends MessageType<ApplyMonitoringSettingsRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.ApplyMonitoringSettingsRequest", [
            { no: 1, name: "dto", kind: "message", T: () => ApplyMonitoringSettingsDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.ApplyMonitoringSettingsRequest
 */
export const ApplyMonitoringSettingsRequest = new ApplyMonitoringSettingsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ApplyMonitoringSettingsResponse$Type extends MessageType<ApplyMonitoringSettingsResponse> {
    constructor() {
        super("fibertest30.rtu_mgmt.ApplyMonitoringSettingsResponse", [
            { no: 1, name: "dto", kind: "message", T: () => RequestAnswer }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.ApplyMonitoringSettingsResponse
 */
export const ApplyMonitoringSettingsResponse = new ApplyMonitoringSettingsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AssignBaseRefsRequest$Type extends MessageType<AssignBaseRefsRequest> {
    constructor() {
        super("fibertest30.rtu_mgmt.AssignBaseRefsRequest", [
            { no: 1, name: "dto", kind: "message", T: () => AssignBaseRefsDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.AssignBaseRefsRequest
 */
export const AssignBaseRefsRequest = new AssignBaseRefsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AssignBaseRefsResponse$Type extends MessageType<AssignBaseRefsResponse> {
    constructor() {
        super("fibertest30.rtu_mgmt.AssignBaseRefsResponse", [
            { no: 1, name: "dto", kind: "message", T: () => BaseRefsAssignedDto }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.rtu_mgmt.AssignBaseRefsResponse
 */
export const AssignBaseRefsResponse = new AssignBaseRefsResponse$Type();
/**
 * @generated ServiceType for protobuf service fibertest30.rtu_mgmt.RtuMgmt
 */
export const RtuMgmt = new ServiceType("fibertest30.rtu_mgmt.RtuMgmt", [
    { name: "TestRtuConnection", options: {}, I: TestRtuConnectionRequest, O: TestRtuConnectionResponse },
    { name: "InitializeRtu", options: {}, I: InitializeRtuRequest, O: InitializeRtuResponse },
    { name: "DoMeasurementClient", options: {}, I: DoMeasurementClientRequest, O: EmptyResponse },
    { name: "DoPreciseMeasurementOutOfTurn", options: {}, I: DoPreciseMeasurementOutOfTurnRequest, O: EmptyResponse },
    { name: "GetMeasurementClientSor", options: {}, I: GetMeasurementClientSorRequest, O: GetSorResponse },
    { name: "GetMeasurementSor", options: {}, I: GetMeasurementSorRequest, O: GetSorResponse },
    { name: "StopMonitoring", options: {}, I: StopMonitoringRequest, O: EmptyResponse },
    { name: "InterruptMeasurement", options: {}, I: InterruptMeasurementRequest, O: EmptyResponse },
    { name: "ApplyMonitoringSettings", options: {}, I: ApplyMonitoringSettingsRequest, O: ApplyMonitoringSettingsResponse },
    { name: "AssignBaseRefs", options: {}, I: AssignBaseRefsRequest, O: AssignBaseRefsResponse }
]);
