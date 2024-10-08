// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "event_tables.proto" (package "fibertest30.event_tables", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { OpticalEvent } from "./events.data";
import { SystemEvent } from "./data.core";
// GetSystemEvents

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
// GetOpticalEvents

/**
 * @generated from protobuf message fibertest30.event_tables.GetOpticalEventsRequest
 */
export interface GetOpticalEventsRequest {
    /**
     * @generated from protobuf field: bool currentEvents = 1;
     */
    currentEvents: boolean;
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
class GetOpticalEventsRequest$Type extends MessageType<GetOpticalEventsRequest> {
    constructor() {
        super("fibertest30.event_tables.GetOpticalEventsRequest", [
            { no: 1, name: "currentEvents", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
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
/**
 * @generated ServiceType for protobuf service fibertest30.event_tables.EventTables
 */
export const EventTables = new ServiceType("fibertest30.event_tables.EventTables", [
    { name: "GetSystemEvents", options: {}, I: GetSystemEventsRequest, O: GetSystemEventsResponse },
    { name: "GetOpticalEvents", options: {}, I: GetOpticalEventsRequest, O: GetOpticalEventsResponse }
]);
