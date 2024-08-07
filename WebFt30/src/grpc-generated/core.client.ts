// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "core.proto" (package "fibertest30.core", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Core } from "./core";
import type { RemoveOtauResponse } from "./core";
import type { RemoveOtauRequest } from "./core";
import type { GetOtauResponse } from "./core";
import type { GetOtauRequest } from "./core";
import type { UpdateOtauResponse } from "./core";
import type { UpdateOtauRequest } from "./core";
import type { AddOxcOtauResponse } from "./core";
import type { AddOxcOtauRequest } from "./core";
import type { AddOsmOtauResponse } from "./core";
import type { AddOsmOtauRequest } from "./core";
import type { DiscoverOxcOtauRequest } from "./core";
import type { DiscoverOtauResponse } from "./core";
import type { DiscoverOsmOtauRequest } from "./core";
import type { BlinkOtauRequest } from "./core";
import type { BlinkOxcOtauRequest } from "./core";
import type { BlinkOtauResponse } from "./core";
import type { BlinkOsmOtauRequest } from "./core";
import type { DismissAllUserSystemNotificationsResponse } from "./core";
import type { DismissAllUserSystemNotificationsRequest } from "./core";
import type { DismissUserSystemNotificationsByLevelResponse } from "./core";
import type { DismissUserSystemNotificationsByLevelRequest } from "./core";
import type { DismissUserSystemNotificationResponse } from "./core";
import type { DismissUserSystemNotificationRequest } from "./core";
import type { GetUserSystemNotificationsResponse } from "./core";
import type { GetUserSystemNotificationsRequest } from "./core";
import type { DismissAllUserAlarmNotificationsResponse } from "./core";
import type { DismissAllUserAlarmNotificationsRequest } from "./core";
import type { DismissUserAlarmNotificationsByLevelResponse } from "./core";
import type { DismissUserAlarmNotificationsByLevelRequest } from "./core";
import type { DismissUserAlarmNotificationResponse } from "./core";
import type { DismissUserAlarmNotificationRequest } from "./core";
import type { GetUserAlarmNotificationsResponse } from "./core";
import type { GetUserAlarmNotificationsRequest } from "./core";
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
     * @generated from protobuf rpc: GetUserAlarmNotifications(fibertest30.core.GetUserAlarmNotificationsRequest) returns (fibertest30.core.GetUserAlarmNotificationsResponse);
     */
    getUserAlarmNotifications(input: GetUserAlarmNotificationsRequest, options?: RpcOptions): UnaryCall<GetUserAlarmNotificationsRequest, GetUserAlarmNotificationsResponse>;
    /**
     * @generated from protobuf rpc: DismissUserAlarmNotification(fibertest30.core.DismissUserAlarmNotificationRequest) returns (fibertest30.core.DismissUserAlarmNotificationResponse);
     */
    dismissUserAlarmNotification(input: DismissUserAlarmNotificationRequest, options?: RpcOptions): UnaryCall<DismissUserAlarmNotificationRequest, DismissUserAlarmNotificationResponse>;
    /**
     * @generated from protobuf rpc: DismissUserAlarmNotificationsByLevel(fibertest30.core.DismissUserAlarmNotificationsByLevelRequest) returns (fibertest30.core.DismissUserAlarmNotificationsByLevelResponse);
     */
    dismissUserAlarmNotificationsByLevel(input: DismissUserAlarmNotificationsByLevelRequest, options?: RpcOptions): UnaryCall<DismissUserAlarmNotificationsByLevelRequest, DismissUserAlarmNotificationsByLevelResponse>;
    /**
     * @generated from protobuf rpc: DismissAllUserAlarmNotifications(fibertest30.core.DismissAllUserAlarmNotificationsRequest) returns (fibertest30.core.DismissAllUserAlarmNotificationsResponse);
     */
    dismissAllUserAlarmNotifications(input: DismissAllUserAlarmNotificationsRequest, options?: RpcOptions): UnaryCall<DismissAllUserAlarmNotificationsRequest, DismissAllUserAlarmNotificationsResponse>;
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
    /**
     * @generated from protobuf rpc: BlinkOsmOtau(fibertest30.core.BlinkOsmOtauRequest) returns (fibertest30.core.BlinkOtauResponse);
     */
    blinkOsmOtau(input: BlinkOsmOtauRequest, options?: RpcOptions): UnaryCall<BlinkOsmOtauRequest, BlinkOtauResponse>;
    /**
     * @generated from protobuf rpc: BlinkOxcOtau(fibertest30.core.BlinkOxcOtauRequest) returns (fibertest30.core.BlinkOtauResponse);
     */
    blinkOxcOtau(input: BlinkOxcOtauRequest, options?: RpcOptions): UnaryCall<BlinkOxcOtauRequest, BlinkOtauResponse>;
    /**
     * @generated from protobuf rpc: BlinkOtau(fibertest30.core.BlinkOtauRequest) returns (fibertest30.core.BlinkOtauResponse);
     */
    blinkOtau(input: BlinkOtauRequest, options?: RpcOptions): UnaryCall<BlinkOtauRequest, BlinkOtauResponse>;
    /**
     * @generated from protobuf rpc: DiscoverOsmOtau(fibertest30.core.DiscoverOsmOtauRequest) returns (fibertest30.core.DiscoverOtauResponse);
     */
    discoverOsmOtau(input: DiscoverOsmOtauRequest, options?: RpcOptions): UnaryCall<DiscoverOsmOtauRequest, DiscoverOtauResponse>;
    /**
     * @generated from protobuf rpc: DiscoverOxcOtau(fibertest30.core.DiscoverOxcOtauRequest) returns (fibertest30.core.DiscoverOtauResponse);
     */
    discoverOxcOtau(input: DiscoverOxcOtauRequest, options?: RpcOptions): UnaryCall<DiscoverOxcOtauRequest, DiscoverOtauResponse>;
    /**
     * @generated from protobuf rpc: AddOsmOtau(fibertest30.core.AddOsmOtauRequest) returns (fibertest30.core.AddOsmOtauResponse);
     */
    addOsmOtau(input: AddOsmOtauRequest, options?: RpcOptions): UnaryCall<AddOsmOtauRequest, AddOsmOtauResponse>;
    /**
     * @generated from protobuf rpc: AddOxcOtau(fibertest30.core.AddOxcOtauRequest) returns (fibertest30.core.AddOxcOtauResponse);
     */
    addOxcOtau(input: AddOxcOtauRequest, options?: RpcOptions): UnaryCall<AddOxcOtauRequest, AddOxcOtauResponse>;
    /**
     * @generated from protobuf rpc: UpdateOtau(fibertest30.core.UpdateOtauRequest) returns (fibertest30.core.UpdateOtauResponse);
     */
    updateOtau(input: UpdateOtauRequest, options?: RpcOptions): UnaryCall<UpdateOtauRequest, UpdateOtauResponse>;
    /**
     * @generated from protobuf rpc: GetOtau(fibertest30.core.GetOtauRequest) returns (fibertest30.core.GetOtauResponse);
     */
    getOtau(input: GetOtauRequest, options?: RpcOptions): UnaryCall<GetOtauRequest, GetOtauResponse>;
    /**
     * @generated from protobuf rpc: RemoveOtau(fibertest30.core.RemoveOtauRequest) returns (fibertest30.core.RemoveOtauResponse);
     */
    removeOtau(input: RemoveOtauRequest, options?: RpcOptions): UnaryCall<RemoveOtauRequest, RemoveOtauResponse>;
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
     * @generated from protobuf rpc: GetUserAlarmNotifications(fibertest30.core.GetUserAlarmNotificationsRequest) returns (fibertest30.core.GetUserAlarmNotificationsResponse);
     */
    getUserAlarmNotifications(input: GetUserAlarmNotificationsRequest, options?: RpcOptions): UnaryCall<GetUserAlarmNotificationsRequest, GetUserAlarmNotificationsResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetUserAlarmNotificationsRequest, GetUserAlarmNotificationsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissUserAlarmNotification(fibertest30.core.DismissUserAlarmNotificationRequest) returns (fibertest30.core.DismissUserAlarmNotificationResponse);
     */
    dismissUserAlarmNotification(input: DismissUserAlarmNotificationRequest, options?: RpcOptions): UnaryCall<DismissUserAlarmNotificationRequest, DismissUserAlarmNotificationResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissUserAlarmNotificationRequest, DismissUserAlarmNotificationResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissUserAlarmNotificationsByLevel(fibertest30.core.DismissUserAlarmNotificationsByLevelRequest) returns (fibertest30.core.DismissUserAlarmNotificationsByLevelResponse);
     */
    dismissUserAlarmNotificationsByLevel(input: DismissUserAlarmNotificationsByLevelRequest, options?: RpcOptions): UnaryCall<DismissUserAlarmNotificationsByLevelRequest, DismissUserAlarmNotificationsByLevelResponse> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissUserAlarmNotificationsByLevelRequest, DismissUserAlarmNotificationsByLevelResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissAllUserAlarmNotifications(fibertest30.core.DismissAllUserAlarmNotificationsRequest) returns (fibertest30.core.DismissAllUserAlarmNotificationsResponse);
     */
    dismissAllUserAlarmNotifications(input: DismissAllUserAlarmNotificationsRequest, options?: RpcOptions): UnaryCall<DismissAllUserAlarmNotificationsRequest, DismissAllUserAlarmNotificationsResponse> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissAllUserAlarmNotificationsRequest, DismissAllUserAlarmNotificationsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetUserSystemNotifications(fibertest30.core.GetUserSystemNotificationsRequest) returns (fibertest30.core.GetUserSystemNotificationsResponse);
     */
    getUserSystemNotifications(input: GetUserSystemNotificationsRequest, options?: RpcOptions): UnaryCall<GetUserSystemNotificationsRequest, GetUserSystemNotificationsResponse> {
        const method = this.methods[6], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetUserSystemNotificationsRequest, GetUserSystemNotificationsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissUserSystemNotification(fibertest30.core.DismissUserSystemNotificationRequest) returns (fibertest30.core.DismissUserSystemNotificationResponse);
     */
    dismissUserSystemNotification(input: DismissUserSystemNotificationRequest, options?: RpcOptions): UnaryCall<DismissUserSystemNotificationRequest, DismissUserSystemNotificationResponse> {
        const method = this.methods[7], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissUserSystemNotificationRequest, DismissUserSystemNotificationResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissUserSystemNotificationsByLevel(fibertest30.core.DismissUserSystemNotificationsByLevelRequest) returns (fibertest30.core.DismissUserSystemNotificationsByLevelResponse);
     */
    dismissUserSystemNotificationsByLevel(input: DismissUserSystemNotificationsByLevelRequest, options?: RpcOptions): UnaryCall<DismissUserSystemNotificationsByLevelRequest, DismissUserSystemNotificationsByLevelResponse> {
        const method = this.methods[8], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissUserSystemNotificationsByLevelRequest, DismissUserSystemNotificationsByLevelResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DismissAllUserSystemNotifications(fibertest30.core.DismissAllUserSystemNotificationsRequest) returns (fibertest30.core.DismissAllUserSystemNotificationsResponse);
     */
    dismissAllUserSystemNotifications(input: DismissAllUserSystemNotificationsRequest, options?: RpcOptions): UnaryCall<DismissAllUserSystemNotificationsRequest, DismissAllUserSystemNotificationsResponse> {
        const method = this.methods[9], opt = this._transport.mergeOptions(options);
        return stackIntercept<DismissAllUserSystemNotificationsRequest, DismissAllUserSystemNotificationsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: BlinkOsmOtau(fibertest30.core.BlinkOsmOtauRequest) returns (fibertest30.core.BlinkOtauResponse);
     */
    blinkOsmOtau(input: BlinkOsmOtauRequest, options?: RpcOptions): UnaryCall<BlinkOsmOtauRequest, BlinkOtauResponse> {
        const method = this.methods[10], opt = this._transport.mergeOptions(options);
        return stackIntercept<BlinkOsmOtauRequest, BlinkOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: BlinkOxcOtau(fibertest30.core.BlinkOxcOtauRequest) returns (fibertest30.core.BlinkOtauResponse);
     */
    blinkOxcOtau(input: BlinkOxcOtauRequest, options?: RpcOptions): UnaryCall<BlinkOxcOtauRequest, BlinkOtauResponse> {
        const method = this.methods[11], opt = this._transport.mergeOptions(options);
        return stackIntercept<BlinkOxcOtauRequest, BlinkOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: BlinkOtau(fibertest30.core.BlinkOtauRequest) returns (fibertest30.core.BlinkOtauResponse);
     */
    blinkOtau(input: BlinkOtauRequest, options?: RpcOptions): UnaryCall<BlinkOtauRequest, BlinkOtauResponse> {
        const method = this.methods[12], opt = this._transport.mergeOptions(options);
        return stackIntercept<BlinkOtauRequest, BlinkOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DiscoverOsmOtau(fibertest30.core.DiscoverOsmOtauRequest) returns (fibertest30.core.DiscoverOtauResponse);
     */
    discoverOsmOtau(input: DiscoverOsmOtauRequest, options?: RpcOptions): UnaryCall<DiscoverOsmOtauRequest, DiscoverOtauResponse> {
        const method = this.methods[13], opt = this._transport.mergeOptions(options);
        return stackIntercept<DiscoverOsmOtauRequest, DiscoverOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DiscoverOxcOtau(fibertest30.core.DiscoverOxcOtauRequest) returns (fibertest30.core.DiscoverOtauResponse);
     */
    discoverOxcOtau(input: DiscoverOxcOtauRequest, options?: RpcOptions): UnaryCall<DiscoverOxcOtauRequest, DiscoverOtauResponse> {
        const method = this.methods[14], opt = this._transport.mergeOptions(options);
        return stackIntercept<DiscoverOxcOtauRequest, DiscoverOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: AddOsmOtau(fibertest30.core.AddOsmOtauRequest) returns (fibertest30.core.AddOsmOtauResponse);
     */
    addOsmOtau(input: AddOsmOtauRequest, options?: RpcOptions): UnaryCall<AddOsmOtauRequest, AddOsmOtauResponse> {
        const method = this.methods[15], opt = this._transport.mergeOptions(options);
        return stackIntercept<AddOsmOtauRequest, AddOsmOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: AddOxcOtau(fibertest30.core.AddOxcOtauRequest) returns (fibertest30.core.AddOxcOtauResponse);
     */
    addOxcOtau(input: AddOxcOtauRequest, options?: RpcOptions): UnaryCall<AddOxcOtauRequest, AddOxcOtauResponse> {
        const method = this.methods[16], opt = this._transport.mergeOptions(options);
        return stackIntercept<AddOxcOtauRequest, AddOxcOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateOtau(fibertest30.core.UpdateOtauRequest) returns (fibertest30.core.UpdateOtauResponse);
     */
    updateOtau(input: UpdateOtauRequest, options?: RpcOptions): UnaryCall<UpdateOtauRequest, UpdateOtauResponse> {
        const method = this.methods[17], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateOtauRequest, UpdateOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetOtau(fibertest30.core.GetOtauRequest) returns (fibertest30.core.GetOtauResponse);
     */
    getOtau(input: GetOtauRequest, options?: RpcOptions): UnaryCall<GetOtauRequest, GetOtauResponse> {
        const method = this.methods[18], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetOtauRequest, GetOtauResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: RemoveOtau(fibertest30.core.RemoveOtauRequest) returns (fibertest30.core.RemoveOtauResponse);
     */
    removeOtau(input: RemoveOtauRequest, options?: RpcOptions): UnaryCall<RemoveOtauRequest, RemoveOtauResponse> {
        const method = this.methods[19], opt = this._transport.mergeOptions(options);
        return stackIntercept<RemoveOtauRequest, RemoveOtauResponse>("unary", this._transport, method, opt, input);
    }
}
