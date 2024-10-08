// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "core.proto" (package "fibertest30.core", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Core } from "./core";
import type { DismissAllUserSystemNotificationsResponse } from "./core";
import type { DismissAllUserSystemNotificationsRequest } from "./core";
import type { DismissUserSystemNotificationsByLevelResponse } from "./core";
import type { DismissUserSystemNotificationsByLevelRequest } from "./core";
import type { DismissUserSystemNotificationResponse } from "./core";
import type { DismissUserSystemNotificationRequest } from "./core";
import type { GetUserSystemNotificationsResponse } from "./core";
import type { GetUserSystemNotificationsRequest } from "./core";
import type { GetSystemMessageStreamResponse } from "./core";
import type { GetSystemMessageStreamRequest } from "./core";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { DeviceInfoResponse } from "./core";
import type { DeviceInfoRequest } from "./core";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service fibertest30.core.Core
 */
export interface ICoreClient {
    /**
     * @generated from protobuf rpc: GetDeviceInfo(fibertest30.core.DeviceInfoRequest) returns (fibertest30.core.DeviceInfoResponse);
     */
    getDeviceInfo(input: DeviceInfoRequest, options?: RpcOptions): UnaryCall<DeviceInfoRequest, DeviceInfoResponse>;
    /**
     * @generated from protobuf rpc: GetSystemMessageStream(fibertest30.core.GetSystemMessageStreamRequest) returns (stream fibertest30.core.GetSystemMessageStreamResponse);
     */
    getSystemMessageStream(input: GetSystemMessageStreamRequest, options?: RpcOptions): ServerStreamingCall<GetSystemMessageStreamRequest, GetSystemMessageStreamResponse>;
    /**
     * @generated from protobuf rpc: GetUserSystemNotifications(fibertest30.core.GetUserSystemNotificationsRequest) returns (fibertest30.core.GetUserSystemNotificationsResponse);
     */
    getUserSystemNotifications(input: GetUserSystemNotificationsRequest, options?: RpcOptions): UnaryCall<GetUserSystemNotificationsRequest, GetUserSystemNotificationsResponse>;
    /**
     * @generated from protobuf rpc: DismissUserSystemNotification(fibertest30.core.DismissUserSystemNotificationRequest) returns (fibertest30.core.DismissUserSystemNotificationResponse);
     */
    dismissUserSystemNotification(input: DismissUserSystemNotificationRequest, options?: RpcOptions): UnaryCall<DismissUserSystemNotificationRequest, DismissUserSystemNotificationResponse>;
    /**
     * @generated from protobuf rpc: DismissUserSystemNotificationsByLevel(fibertest30.core.DismissUserSystemNotificationsByLevelRequest) returns (fibertest30.core.DismissUserSystemNotificationsByLevelResponse);
     */
    dismissUserSystemNotificationsByLevel(input: DismissUserSystemNotificationsByLevelRequest, options?: RpcOptions): UnaryCall<DismissUserSystemNotificationsByLevelRequest, DismissUserSystemNotificationsByLevelResponse>;
    /**
     * @generated from protobuf rpc: DismissAllUserSystemNotifications(fibertest30.core.DismissAllUserSystemNotificationsRequest) returns (fibertest30.core.DismissAllUserSystemNotificationsResponse);
     */
    dismissAllUserSystemNotifications(input: DismissAllUserSystemNotificationsRequest, options?: RpcOptions): UnaryCall<DismissAllUserSystemNotificationsRequest, DismissAllUserSystemNotificationsResponse>;
}
/**
 * @generated from protobuf service fibertest30.core.Core
 */
export class CoreClient implements ICoreClient, ServiceInfo {
    typeName = Core.typeName;
    methods = Core.methods;
    options = Core.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetDeviceInfo(fibertest30.core.DeviceInfoRequest) returns (fibertest30.core.DeviceInfoResponse);
     */
    getDeviceInfo(input: DeviceInfoRequest, options?: RpcOptions): UnaryCall<DeviceInfoRequest, DeviceInfoResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<DeviceInfoRequest, DeviceInfoResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetSystemMessageStream(fibertest30.core.GetSystemMessageStreamRequest) returns (stream fibertest30.core.GetSystemMessageStreamResponse);
     */
    getSystemMessageStream(input: GetSystemMessageStreamRequest, options?: RpcOptions): ServerStreamingCall<GetSystemMessageStreamRequest, GetSystemMessageStreamResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetSystemMessageStreamRequest, GetSystemMessageStreamResponse>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetUserSystemNotifications(fibertest30.core.GetUserSystemNotificationsRequest) returns (fibertest30.core.GetUserSystemNotificationsResponse);
     */
    getUserSystemNotifications(input: GetUserSystemNotificationsRequest, options?: RpcOptions): UnaryCall<GetUserSystemNotificationsRequest, GetUserSystemNotificationsResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetUserSystemNotificationsRequest, GetUserSystemNotificationsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissUserSystemNotification(fibertest30.core.DismissUserSystemNotificationRequest) returns (fibertest30.core.DismissUserSystemNotificationResponse);
     */
    dismissUserSystemNotification(input: DismissUserSystemNotificationRequest, options?: RpcOptions): UnaryCall<DismissUserSystemNotificationRequest, DismissUserSystemNotificationResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissUserSystemNotificationRequest, DismissUserSystemNotificationResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissUserSystemNotificationsByLevel(fibertest30.core.DismissUserSystemNotificationsByLevelRequest) returns (fibertest30.core.DismissUserSystemNotificationsByLevelResponse);
     */
    dismissUserSystemNotificationsByLevel(input: DismissUserSystemNotificationsByLevelRequest, options?: RpcOptions): UnaryCall<DismissUserSystemNotificationsByLevelRequest, DismissUserSystemNotificationsByLevelResponse> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissUserSystemNotificationsByLevelRequest, DismissUserSystemNotificationsByLevelResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissAllUserSystemNotifications(fibertest30.core.DismissAllUserSystemNotificationsRequest) returns (fibertest30.core.DismissAllUserSystemNotificationsResponse);
     */
    dismissAllUserSystemNotifications(input: DismissAllUserSystemNotificationsRequest, options?: RpcOptions): UnaryCall<DismissAllUserSystemNotificationsRequest, DismissAllUserSystemNotificationsResponse> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissAllUserSystemNotificationsRequest, DismissAllUserSystemNotificationsResponse>("unary", this._transport, method, opt, input);
    }
}
