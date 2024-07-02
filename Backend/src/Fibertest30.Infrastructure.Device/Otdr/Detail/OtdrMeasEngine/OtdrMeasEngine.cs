using Grpc.Core;
using Grpc.Net.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using GrpcOtdr = Optixsoft.GrpcOtdr;

namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;
public class OtdrMeasEngine
{
    // TODO: do we need locks in the class??
    // TODO: unify LiveRefreshTime(s) vs LiveAveragingTime(s)


    private ILogger<OtdrMeasEngine> _logger;
    private GrpcOtdr.OtdrService.OtdrServiceClient _grpcClient;
    private string _clientTarget;

    public OtdrMeasEngine(
        ILogger<OtdrMeasEngine> logger,
        IOptions<Settings> settings)
    {
        _logger = logger;

        // TODO: add logic to kill and restart the server when needed.
            
        // TODO: do we need to Dispose?
        var channel = CreateGrpcChannel(settings.Value.Validate());
        _grpcClient = new GrpcOtdr.OtdrService.OtdrServiceClient(channel);
        _clientTarget = channel.Target;
    }

    public async Task<GetInfoResponse> GetInfo(CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.GetInfoRequest();
        var grpcResponse = await PerformGrpcCall(_grpcClient.GetInfoAsync, grpcRequest, ct);
        return grpcResponse.FromGrpc();
    }

    public async Task PresetSorFields(PresetSorFieldsRequest request, CancellationToken ct = default)
    {
        var grpcRequest = request.ToGrpc();
        await PerformGrpcCall(_grpcClient.PresetSorFieldsAsync, grpcRequest, ct);
    }

    public async Task<ConnectOtdrResponse> ConnectOtdr(ConnectOtdrRequest request, CancellationToken ct = default)
    {
        const double timeoutMs = 30_000;
        var grpcRequest = request.ToGrpc();
        var grpcResponse = await PerformGrpcCall(_grpcClient.ConnectOtdrAsync, grpcRequest, ct, timeoutMs);
        return grpcResponse.FromGrpc();
    }

    public async Task DisconnectOtdr(CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.DisconnectOtdrRequest();
        await PerformGrpcCall(_grpcClient.DisconnectOtdrAsync, grpcRequest, ct);
    }

    public async Task SetLaser(Laser laser, CancellationToken ct = default)
    {
        var grpcRequest = laser.ToGrpc();
        await PerformGrpcCall(_grpcClient.SetLaserAsync, grpcRequest, ct);
    }

    public async Task SetOpticalLineProperties(
        OpticalLineProperties opticalLineProperties, CancellationToken ct = default)
    {
        var grpcRequest = opticalLineProperties.ToGrpc();
        await PerformGrpcCall(_grpcClient.SetOpticalLinePropertiesAsync, grpcRequest, ct);
    }

    public async Task<AnalyseOpticalLineResponse> AnalyseOpticalLine(CancellationToken ct = default)
    {
        const double timeoutMs = 10_000;
        var grpcRequest = new GrpcOtdr.AnalyseOpticalLineRequest();
        var grpcResponse = await PerformGrpcCall(_grpcClient.AnalyseOpticalLineAsync, grpcRequest, ct, timeoutMs);
        return grpcResponse.FromGrpc();
    }

    public async Task ForceOpticalLineLmax(int lmaxNs, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.ForceOpticalLineLmaxRequest() { LmaxNs = lmaxNs };
        await PerformGrpcCall(_grpcClient.ForceOpticalLineLmaxAsync, grpcRequest, ct);
    }

    public async Task<PrepareVscoutResponse> PrepareVscout(PrepareVscoutRequest request, CancellationToken ct = default)
    {
        var grpcRequest = request.ToGrpc();
        var grpcResponse = await PerformGrpcCall(_grpcClient.PrepareVscoutAsync, grpcRequest, ct);
        return grpcResponse.FromGrpc();
    }

    public async Task<ApplyVscoutTraceAcquisitionParametersResponse> ApplyVscoutTraceAcquisitionParameters(
        int vscoutIndex, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.ApplyVscoutTraceAcquisitionParametersRequest() { VscoutIndex = vscoutIndex };
        var grpcResponse = await PerformGrpcCall(_grpcClient.ApplyVscoutTraceAcquisitionParametersAsync, grpcRequest, ct);
        return grpcResponse.FromGrpc();
    }

    public async Task SetRefractiveIndex(double refractiveIndex, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetRefractiveIndexRequest() { RefractiveIndex = refractiveIndex };
        await PerformGrpcCall(_grpcClient.SetRefractiveIndexAsync, grpcRequest, ct);
    }

    public async Task SetBackscatterCoefficient(double backscatterCoefficient, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetBackscatterCoefficientRequest() { BackscatterCoefficient = backscatterCoefficient };
        await PerformGrpcCall(_grpcClient.SetBackscatterCoefficientAsync, grpcRequest, ct);
    }

    public async Task SetDistanceRange(string distanceRange, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetDistanceRangeRequest() { DistanceRange = distanceRange };
        await PerformGrpcCall(_grpcClient.SetDistanceRangeAsync, grpcRequest, ct);
    }
    public async Task SetDistanceRange(double distanceRange, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetDistanceRangeRequest() { CustomDistanceRange = distanceRange };
        await PerformGrpcCall(_grpcClient.SetDistanceRangeAsync, grpcRequest, ct);
    }

    public async Task SetResolution(string resolution, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetResolutionRequest() { Resolution = resolution };
        await PerformGrpcCall(_grpcClient.SetResolutionAsync, grpcRequest, ct);
    }

    public async Task SetPulseDuration(string pulseDuration, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetPulseDurationRequest() { PulseDuration = pulseDuration };
        await PerformGrpcCall(_grpcClient.SetPulseDurationAsync, grpcRequest, ct);
    }
    public async Task SetPulseDuration(double pulseDuration, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetPulseDurationRequest() { CustomPulseDuration = pulseDuration };
        await PerformGrpcCall(_grpcClient.SetPulseDurationAsync, grpcRequest, ct);
    }

    public async Task SetAveragingTime(string averagingTime, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetAveragingRequest() { AveragingTime = averagingTime };
        await PerformGrpcCall(_grpcClient.SetAveragingAsync, grpcRequest, ct);
    }

    public async Task SetMinAveragingScale(CancellationToken ct = default)
    {
        var minAveragingScale = 15;
        var grpcRequest = new GrpcOtdr.SetAveragingRequest() { AveragingScale = minAveragingScale };
        await PerformGrpcCall(_grpcClient.SetAveragingAsync, grpcRequest, ct);
    }

    public async Task SetLiveAveragingTime(string liveAveragingTime, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetLiveRefreshTimeRequest() { LiveRefreshTime = liveAveragingTime };
        await PerformGrpcCall(_grpcClient.SetLiveRefreshTimeAsync, grpcRequest, ct);
    }

    public async Task SetHighResolutionOptimization(bool preferDZOverDR, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetHighResolutionOptimizationRequest()
        { Optimization = preferDZOverDR ? GrpcOtdr.SetHighResolutionOptimizationRequest.Types.Optimization.ForDeadZone :
                                          GrpcOtdr.SetHighResolutionOptimizationRequest.Types.Optimization.ForDynamicRange };
        await PerformGrpcCall(_grpcClient.SetHighResolutionOptimizationAsync, grpcRequest, ct);
    }

    public async Task SetParametersFromSor(byte[] sorData, CancellationToken ct = default)
    {
        var grpcRequest = new GrpcOtdr.SetParametersFromSorRequest() { SorData = Google.Protobuf.ByteString.CopyFrom(sorData) };
        await PerformGrpcCall(_grpcClient.SetParametersFromSorAsync, grpcRequest, ct);
    }

    public async Task<StartTraceAcquisitionResponse> StartTraceAcquisition(
        StartTraceAcquisitionRequest request, CancellationToken ct = default)
    {
        var grpcRequest = request.ToGrpc();
        var grpcResponse = await PerformGrpcCall(_grpcClient.StartTraceAcquisitionAsync, grpcRequest, ct);
        return grpcResponse.FromGrpc();
    }

    public async Task<NextTraceAcquisitionStepResponse> NextTraceAcquisitionStep(
        NextTraceAcquisitionStepRequest request, CancellationToken ct = default)
    {
        const double timeoutMs = 30_000;
        var grpcRequest = request.ToGrpc();
        var grpcResponse = await PerformGrpcCall(_grpcClient.NextTraceAcquisitionStepAsync, grpcRequest, ct, timeoutMs);
        return grpcResponse.FromGrpc();
    }

    public async Task AbortTraceAcquisition(CancellationToken ct = default)
    {
        const double timeoutMs = 30_000;
        var grpcRequest = new GrpcOtdr.AbortTraceAcquisitionRequest();
        await PerformGrpcCall(_grpcClient.AbortTraceAcquisitionAsync, grpcRequest, ct, timeoutMs);
    }

    public async Task<AnalyseTraceResponse> AnalyseTrace(AnalyseTraceRequest request, CancellationToken ct = default)
    {
        const double timeoutMs = 10_000;
        var grpcRequest = request.ToGrpc();
        var grpcResponse = await PerformGrpcCall(_grpcClient.AnalyseTraceAsync, grpcRequest, ct, timeoutMs);
        return grpcResponse.FromGrpc();
    }

    public async Task<CompareTracesResponse> CompareTraces(CompareTracesRequest request, CancellationToken ct = default)
    {
        const double timeoutMs = 15_000; // TODO: investigate why it's so slow
        var grpcRequest = request.ToGrpc();
        var grpcResponse = await PerformGrpcCall(_grpcClient.CompareTracesAsync, grpcRequest, ct, timeoutMs);
        return grpcResponse.FromGrpc();
    }

    public async Task<GenerateLinkmapResponse> GenerateLinkmap(GenerateLinkmapRequest request, CancellationToken ct = default)
    {
        var grpcRequest = request.ToGrpc();
        var grpcResponse = await PerformGrpcCall(_grpcClient.GenerateLinkmapAsync, grpcRequest, ct);
        return grpcResponse.FromGrpc();
    }

    private const double DefaultCallTimeoutMs = 5_000;

    private CallOptions CreateGrpcCallOptions(CancellationToken ct, double timeoutMs = DefaultCallTimeoutMs)
    {
        return new CallOptions(
            cancellationToken: ct,
            deadline: DateTime.UtcNow + TimeSpan.FromMilliseconds(timeoutMs));
    }

    private delegate AsyncUnaryCall<TResponse> AsyncGrpcOtdrCall<TRequest, TResponse>(TRequest request, CallOptions opts)
        where TRequest : Google.Protobuf.IMessage<TRequest>
        where TResponse : Google.Protobuf.IMessage<TResponse>;

    private async Task<TResponse> PerformGrpcCall<TRequest, TResponse>(
        AsyncGrpcOtdrCall<TRequest, TResponse> grpcCall,
        TRequest request,
        CancellationToken ct,
        double timeoutMs = DefaultCallTimeoutMs)
            where TRequest : Google.Protobuf.IMessage<TRequest>
            where TResponse : Google.Protobuf.IMessage<TResponse>
    {
        try
        {
            CallOptions opts = CreateGrpcCallOptions(ct, timeoutMs);
            return await grpcCall(request, opts).ResponseAsync;
        }
        catch (RpcException e)
        {
            var server = $"OtdrMeasEngine GRPC server at {_clientTarget}";
            switch (e.StatusCode)
            {
                case StatusCode.InvalidArgument: throw new ArgumentException($"{server} failed to accept the arguments passed", e);
                case StatusCode.FailedPrecondition: throw new InvalidOperationException($"{server} failed to accept the call in current state", e);
                case StatusCode.Unavailable: throw new Exception($"{server} is unavailable or crashed", e);
                case StatusCode.DeadlineExceeded: throw new TimeoutException($"Timeout while calling {server}", e);
                case StatusCode.Cancelled: throw new OperationCanceledException($"Call to {server} was canceled by the client", e);
                default: throw new Exception($"Failed to call {server}", e);
            }
        }
    }

    private GrpcChannel CreateGrpcChannel(Settings settings)
    {
        return GrpcChannel.ForAddress($"http://{settings.ServerHost}:{settings.ServerPort}");
    }
}