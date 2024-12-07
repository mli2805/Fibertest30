// @generated by protobuf-ts 2.9.4 with parameter long_type_string,optimize_code_size
// @generated from protobuf file "graph.proto" (package "fibertest30.graph", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Graph } from "./graph";
import type { SendCommandRequest } from "./graph";
import type { UpdateTraceInfoRequest } from "./graph";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { SendCommandResponse } from "./graph";
import type { UpdateRtuInfoRequest } from "./graph";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service fibertest30.graph.Graph
 */
export interface IGraphClient {
    /**
     * @generated from protobuf rpc: UpdateRtuInfo(fibertest30.graph.UpdateRtuInfoRequest) returns (fibertest30.graph.SendCommandResponse);
     */
    updateRtuInfo(input: UpdateRtuInfoRequest, options?: RpcOptions): UnaryCall<UpdateRtuInfoRequest, SendCommandResponse>;
    /**
     * @generated from protobuf rpc: UpdateTraceInfo(fibertest30.graph.UpdateTraceInfoRequest) returns (fibertest30.graph.SendCommandResponse);
     */
    updateTraceInfo(input: UpdateTraceInfoRequest, options?: RpcOptions): UnaryCall<UpdateTraceInfoRequest, SendCommandResponse>;
    /**
     * @generated from protobuf rpc: SendCommand(fibertest30.graph.SendCommandRequest) returns (fibertest30.graph.SendCommandResponse);
     */
    sendCommand(input: SendCommandRequest, options?: RpcOptions): UnaryCall<SendCommandRequest, SendCommandResponse>;
}
/**
 * @generated from protobuf service fibertest30.graph.Graph
 */
export class GraphClient implements IGraphClient, ServiceInfo {
    typeName = Graph.typeName;
    methods = Graph.methods;
    options = Graph.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: UpdateRtuInfo(fibertest30.graph.UpdateRtuInfoRequest) returns (fibertest30.graph.SendCommandResponse);
     */
    updateRtuInfo(input: UpdateRtuInfoRequest, options?: RpcOptions): UnaryCall<UpdateRtuInfoRequest, SendCommandResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateRtuInfoRequest, SendCommandResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateTraceInfo(fibertest30.graph.UpdateTraceInfoRequest) returns (fibertest30.graph.SendCommandResponse);
     */
    updateTraceInfo(input: UpdateTraceInfoRequest, options?: RpcOptions): UnaryCall<UpdateTraceInfoRequest, SendCommandResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateTraceInfoRequest, SendCommandResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: SendCommand(fibertest30.graph.SendCommandRequest) returns (fibertest30.graph.SendCommandResponse);
     */
    sendCommand(input: SendCommandRequest, options?: RpcOptions): UnaryCall<SendCommandRequest, SendCommandResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<SendCommandRequest, SendCommandResponse>("unary", this._transport, method, opt, input);
    }
}
