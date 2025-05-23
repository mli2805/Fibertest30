// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "event_tables.proto" (package "fibertest30.event_tables", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { HasCurrentEvents } from "./data.core";
import { RtuAccident } from "./events.data";
import { BopEvent } from "./events.data";
import { NetworkEvent } from "./events.data";
import { DateTimeFilter } from "./events.data";
import { OpticalEvent } from "./events.data";
import { SystemEvent } from "./data.core";
/**
 * @generated from protobuf message fibertest30.event_tables.GetSystemEventsRequest
 */
export interface GetSystemEventsRequest {
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetSystemEventsResponse
 */
export interface GetSystemEventsResponse {
    /**
     * @generated from protobuf field: repeated fibertest30.data.core.SystemEvent systemEvents = 1;
     */
    systemEvents: SystemEvent[];
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetOpticalEventRequest
 */
export interface GetOpticalEventRequest {
    /**
     * @generated from protobuf field: int32 eventId = 1;
     */
    eventId: number;
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetOpticalEventResponse
 */
export interface GetOpticalEventResponse {
    /**
     * @generated from protobuf field: fibertest30.events.data.OpticalEvent opticalEvent = 1;
     */
    opticalEvent?: OpticalEvent;
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetOpticalEventsRequest
 */
export interface GetOpticalEventsRequest {
    /**
     * @generated from protobuf field: bool currentEvents = 1;
     */
    currentEvents: boolean;
    /**
     * @generated from protobuf field: fibertest30.events.data.DateTimeFilter dateTimeFilter = 2;
     */
    dateTimeFilter?: DateTimeFilter;
    /**
     * @generated from protobuf field: int32 portionSize = 3;
     */
    portionSize: number;
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetOpticalEventsResponse
 */
export interface GetOpticalEventsResponse {
    /**
     * @generated from protobuf field: repeated fibertest30.events.data.OpticalEvent opticalEvents = 1;
     */
    opticalEvents: OpticalEvent[];
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetNetworkEventsRequest
 */
export interface GetNetworkEventsRequest {
    /**
     * @generated from protobuf field: bool currentEvents = 1;
     */
    currentEvents: boolean;
    /**
     * @generated from protobuf field: fibertest30.events.data.DateTimeFilter dateTimeFilter = 2;
     */
    dateTimeFilter?: DateTimeFilter;
    /**
     * @generated from protobuf field: int32 portionSize = 3;
     */
    portionSize: number;
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetNetworkEventsResponse
 */
export interface GetNetworkEventsResponse {
    /**
     * @generated from protobuf field: repeated fibertest30.events.data.NetworkEvent networkEvents = 1;
     */
    networkEvents: NetworkEvent[];
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetBopEventsRequest
 */
export interface GetBopEventsRequest {
    /**
     * @generated from protobuf field: bool currentEvents = 1;
     */
    currentEvents: boolean;
    /**
     * @generated from protobuf field: fibertest30.events.data.DateTimeFilter dateTimeFilter = 2;
     */
    dateTimeFilter?: DateTimeFilter;
    /**
     * @generated from protobuf field: int32 portionSize = 3;
     */
    portionSize: number;
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetBopEventsResponse
 */
export interface GetBopEventsResponse {
    /**
     * @generated from protobuf field: repeated fibertest30.events.data.BopEvent bopEvents = 1;
     */
    bopEvents: BopEvent[];
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetRtuAccidentsRequest
 */
export interface GetRtuAccidentsRequest {
    /**
     * @generated from protobuf field: bool currentAccidents = 1;
     */
    currentAccidents: boolean;
    /**
     * @generated from protobuf field: fibertest30.events.data.DateTimeFilter dateTimeFilter = 2;
     */
    dateTimeFilter?: DateTimeFilter;
    /**
     * @generated from protobuf field: int32 portionSize = 3;
     */
    portionSize: number;
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetRtuAccidentsResponse
 */
export interface GetRtuAccidentsResponse {
    /**
     * @generated from protobuf field: repeated fibertest30.events.data.RtuAccident rtuAccidents = 1;
     */
    rtuAccidents: RtuAccident[];
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetHasCurrentRequest
 */
export interface GetHasCurrentRequest {
}
/**
 * @generated from protobuf message fibertest30.event_tables.GetHasCurrentResponse
 */
export interface GetHasCurrentResponse {
    /**
     * @generated from protobuf field: fibertest30.data.core.HasCurrentEvents hasCurrentEvents = 1;
     */
    hasCurrentEvents?: HasCurrentEvents;
}
// @generated message type with reflection information, may provide speed optimized methods
class GetSystemEventsRequest$Type extends MessageType<GetSystemEventsRequest> {
    constructor() {
        super("fibertest30.event_tables.GetSystemEventsRequest", []);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetSystemEventsRequest
 */
export const GetSystemEventsRequest = new GetSystemEventsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSystemEventsResponse$Type extends MessageType<GetSystemEventsResponse> {
    constructor() {
        super("fibertest30.event_tables.GetSystemEventsResponse", [
            { no: 1, name: "systemEvents", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SystemEvent }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetSystemEventsResponse
 */
export const GetSystemEventsResponse = new GetSystemEventsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetOpticalEventRequest$Type extends MessageType<GetOpticalEventRequest> {
    constructor() {
        super("fibertest30.event_tables.GetOpticalEventRequest", [
            { no: 1, name: "eventId", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetOpticalEventRequest
 */
export const GetOpticalEventRequest = new GetOpticalEventRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetOpticalEventResponse$Type extends MessageType<GetOpticalEventResponse> {
    constructor() {
        super("fibertest30.event_tables.GetOpticalEventResponse", [
            { no: 1, name: "opticalEvent", kind: "message", T: () => OpticalEvent }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetOpticalEventResponse
 */
export const GetOpticalEventResponse = new GetOpticalEventResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetOpticalEventsRequest$Type extends MessageType<GetOpticalEventsRequest> {
    constructor() {
        super("fibertest30.event_tables.GetOpticalEventsRequest", [
            { no: 1, name: "currentEvents", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "dateTimeFilter", kind: "message", T: () => DateTimeFilter },
            { no: 3, name: "portionSize", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetOpticalEventsRequest
 */
export const GetOpticalEventsRequest = new GetOpticalEventsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetOpticalEventsResponse$Type extends MessageType<GetOpticalEventsResponse> {
    constructor() {
        super("fibertest30.event_tables.GetOpticalEventsResponse", [
            { no: 1, name: "opticalEvents", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => OpticalEvent }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetOpticalEventsResponse
 */
export const GetOpticalEventsResponse = new GetOpticalEventsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetNetworkEventsRequest$Type extends MessageType<GetNetworkEventsRequest> {
    constructor() {
        super("fibertest30.event_tables.GetNetworkEventsRequest", [
            { no: 1, name: "currentEvents", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "dateTimeFilter", kind: "message", T: () => DateTimeFilter },
            { no: 3, name: "portionSize", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetNetworkEventsRequest
 */
export const GetNetworkEventsRequest = new GetNetworkEventsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetNetworkEventsResponse$Type extends MessageType<GetNetworkEventsResponse> {
    constructor() {
        super("fibertest30.event_tables.GetNetworkEventsResponse", [
            { no: 1, name: "networkEvents", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => NetworkEvent }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetNetworkEventsResponse
 */
export const GetNetworkEventsResponse = new GetNetworkEventsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetBopEventsRequest$Type extends MessageType<GetBopEventsRequest> {
    constructor() {
        super("fibertest30.event_tables.GetBopEventsRequest", [
            { no: 1, name: "currentEvents", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "dateTimeFilter", kind: "message", T: () => DateTimeFilter },
            { no: 3, name: "portionSize", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetBopEventsRequest
 */
export const GetBopEventsRequest = new GetBopEventsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetBopEventsResponse$Type extends MessageType<GetBopEventsResponse> {
    constructor() {
        super("fibertest30.event_tables.GetBopEventsResponse", [
            { no: 1, name: "bopEvents", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => BopEvent }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetBopEventsResponse
 */
export const GetBopEventsResponse = new GetBopEventsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetRtuAccidentsRequest$Type extends MessageType<GetRtuAccidentsRequest> {
    constructor() {
        super("fibertest30.event_tables.GetRtuAccidentsRequest", [
            { no: 1, name: "currentAccidents", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "dateTimeFilter", kind: "message", T: () => DateTimeFilter },
            { no: 3, name: "portionSize", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetRtuAccidentsRequest
 */
export const GetRtuAccidentsRequest = new GetRtuAccidentsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetRtuAccidentsResponse$Type extends MessageType<GetRtuAccidentsResponse> {
    constructor() {
        super("fibertest30.event_tables.GetRtuAccidentsResponse", [
            { no: 1, name: "rtuAccidents", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => RtuAccident }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetRtuAccidentsResponse
 */
export const GetRtuAccidentsResponse = new GetRtuAccidentsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetHasCurrentRequest$Type extends MessageType<GetHasCurrentRequest> {
    constructor() {
        super("fibertest30.event_tables.GetHasCurrentRequest", []);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetHasCurrentRequest
 */
export const GetHasCurrentRequest = new GetHasCurrentRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetHasCurrentResponse$Type extends MessageType<GetHasCurrentResponse> {
    constructor() {
        super("fibertest30.event_tables.GetHasCurrentResponse", [
            { no: 1, name: "hasCurrentEvents", kind: "message", T: () => HasCurrentEvents }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message fibertest30.event_tables.GetHasCurrentResponse
 */
export const GetHasCurrentResponse = new GetHasCurrentResponse$Type();
/**
 * @generated ServiceType for protobuf service fibertest30.event_tables.EventTables
 */
export const EventTables = new ServiceType("fibertest30.event_tables.EventTables", [
    { name: "GetSystemEvents", options: {}, I: GetSystemEventsRequest, O: GetSystemEventsResponse },
    { name: "GetOpticalEvent", options: {}, I: GetOpticalEventRequest, O: GetOpticalEventResponse },
    { name: "GetOpticalEvents", options: {}, I: GetOpticalEventsRequest, O: GetOpticalEventsResponse },
    { name: "GetNetworkEvents", options: {}, I: GetNetworkEventsRequest, O: GetNetworkEventsResponse },
    { name: "GetBopEvents", options: {}, I: GetBopEventsRequest, O: GetBopEventsResponse },
    { name: "GetRtuAccidents", options: {}, I: GetRtuAccidentsRequest, O: GetRtuAccidentsResponse },
    { name: "GetHasCurrent", options: {}, I: GetHasCurrentRequest, O: GetHasCurrentResponse }
]);
