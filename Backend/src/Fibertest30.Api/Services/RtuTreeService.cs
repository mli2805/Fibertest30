using Grpc.Core;
using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Api;

public class RtuTreeService : RtuTree.RtuTreeBase
{
    private readonly ISender _mediator;

    public RtuTreeService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<GetRtuTreeResponse> GetRtuTree(GetRtuTreeRequest request, ServerCallContext context)
    {
        var tree = await _mediator.Send(new GetRtuTreeQuery(), context.CancellationToken);
        return new GetRtuTreeResponse() { Rtus = { tree.Select(r => r.ToProto()) } };
    }

    public override async Task<GetRtuResponse> GetRtu(GetRtuRequest request, ServerCallContext context)
    {
        var rtuDto = await _mediator.Send(new GetRtuQuery(request.RtuId), context.CancellationToken);
        return new GetRtuResponse() { Rtu = rtuDto.ToProto() };
    }

    public override async Task<AttachTraceResponse> AttachTrace(AttachTraceRequest request, ServerCallContext context)
    {
        var dto = new AttachTraceDto { TraceId = Guid.Parse(request.TraceId) };
        var ports = new List<OtauPortDto>(request.PortOfOtau.Select(p => p.FromProto()));
        dto.OtauPortDto = ports[0];
        if (ports.Count > 1)
            dto.MainOtauPortDto = ports[1];

        await _mediator.Send(new AttachTraceCommand(dto), context.CancellationToken);
        return new AttachTraceResponse();
    }

    public override async Task<DetachTraceResponse> DetachTrace(DetachTraceRequest request, ServerCallContext context)
    {
        var guid = Guid.Parse(request.TraceId);
        await _mediator.Send(new DetachTraceCommand(guid), context.CancellationToken);
        return new DetachTraceResponse();
    }

    public override async Task<AttachOtauResponse> AttachOtau(AttachOtauRequest request, ServerCallContext context)
    {
        var dto = request.FromProto();
        await _mediator.Send(new AttachOtauCommand(dto), context.CancellationToken);
        return new AttachOtauResponse();
    }

    public override async Task<DetachOtauResponse> DetachOtau(DetachOtauRequest request, ServerCallContext context)
    {
        var dto = request.FromProto();
        await _mediator.Send(new DetachOtauCommand(dto), context.CancellationToken);
        return new DetachOtauResponse();
    }

    public override async Task<GetTraceBaselineStatResponse> GetTraceBaselineStat(GetTraceBaselineStatRequest request,
        ServerCallContext context)
    {
        var baselines = await _mediator.Send(new GetTraceBaselineStatQuery(Guid.Parse(request.TraceId)),
            context.CancellationToken);
        return new GetTraceBaselineStatResponse() { Baselines = { baselines.Select(b => b.ToProto()) } };
    }

    public override async Task<GetTraceStatisticsResponse> GetTraceStatistics(GetTraceStatisticsRequest request,
        ServerCallContext context)
    {
        var measurements = await _mediator.Send(new GetTraceMeasurementStatQuery(Guid.Parse(request.TraceId)),
            context.CancellationToken);
        return new GetTraceStatisticsResponse() { Measurements = { measurements.Select(m => m.ToProto()) } };
    }

    public override async Task<GetTraceLastMeasurementResponse> GetTraceLastMeasurement(
        GetTraceLastMeasurementRequest request, ServerCallContext context)
    {
        var sorFileId = await _mediator.Send(new GetTraceLastMeasurement(Guid.Parse(request.TraceId)),
            context.CancellationToken);

        return new GetTraceLastMeasurementResponse() { SorFileId = sorFileId };
    }
}