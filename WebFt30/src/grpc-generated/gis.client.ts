// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "gis.proto" (package "fibertest30.gis", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Gis } from "./gis";
import type { GetFiberInfoResponse } from "./gis";
import type { GetFiberInfoRequest } from "./gis";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { GetAllGeoDataResponse } from "./gis";
import type { GetAllGeoDataRequest } from "./gis";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service fibertest30.gis.Gis
 */
export interface IGisClient {
    /**
     * @generated from protobuf rpc: GetAllGeoData(fibertest30.gis.GetAllGeoDataRequest) returns (fibertest30.gis.GetAllGeoDataResponse);
     */
    getAllGeoData(input: GetAllGeoDataRequest, options?: RpcOptions): UnaryCall<GetAllGeoDataRequest, GetAllGeoDataResponse>;
    /**
     * @generated from protobuf rpc: GetFiberInfo(fibertest30.gis.GetFiberInfoRequest) returns (fibertest30.gis.GetFiberInfoResponse);
     */
    getFiberInfo(input: GetFiberInfoRequest, options?: RpcOptions): UnaryCall<GetFiberInfoRequest, GetFiberInfoResponse>;
}
/**
 * @generated from protobuf service fibertest30.gis.Gis
 */
export class GisClient implements IGisClient, ServiceInfo {
    typeName = Gis.typeName;
    methods = Gis.methods;
    options = Gis.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetAllGeoData(fibertest30.gis.GetAllGeoDataRequest) returns (fibertest30.gis.GetAllGeoDataResponse);
     */
    getAllGeoData(input: GetAllGeoDataRequest, options?: RpcOptions): UnaryCall<GetAllGeoDataRequest, GetAllGeoDataResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetAllGeoDataRequest, GetAllGeoDataResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetFiberInfo(fibertest30.gis.GetFiberInfoRequest) returns (fibertest30.gis.GetFiberInfoResponse);
     */
    getFiberInfo(input: GetFiberInfoRequest, options?: RpcOptions): UnaryCall<GetFiberInfoRequest, GetFiberInfoResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetFiberInfoRequest, GetFiberInfoResponse>("unary", this._transport, method, opt, input);
    }
}
