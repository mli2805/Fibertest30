using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class RtuMgmtService : RtuMgmt.RtuMgmtBase
{
    private readonly ISender _mediator;

    public RtuMgmtService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<TestRtuConnectionResponse> TestRtuConnection(TestRtuConnectionRequest request,
        ServerCallContext context)
    {
        var rtuConnectionCheckedDto = await _mediator
            .Send(new TestRtuConnectionCommand(request.NetAddress.FromProto()), context.CancellationToken);
        return new TestRtuConnectionResponse()
        {
            NetAddress = rtuConnectionCheckedDto.NetAddress.ToProto(),
            IsConnectionSuccessful = rtuConnectionCheckedDto.IsConnectionSuccessfull
        };
    }

    public override async Task<InitializeRtuResponse> InitializeRtu(InitializeRtuRequest request,
        ServerCallContext context)
    {
        var dto = await _mediator.Send(new InitializeRtuCommand(request.Dto.FromProto()), context.CancellationToken);
        return new InitializeRtuResponse() { Dto = dto.ToProto() };
    }

    public override async Task<EmptyResponse> DoMeasurementClient(DoMeasurementClientRequest request,
        ServerCallContext context)
    {
        await _mediator.Send(new DoMeasurementClientCommand(request.Dto.FromProto()),
           context.CancellationToken);

        return new EmptyResponse();
    }

    public override async Task<GetSorResponse> GetMeasurementClientSor(
        GetMeasurementClientSorRequest request, ServerCallContext context)
    {
        var sor = await _mediator.Send(new GetMeasurementClientSorQuery(Guid.Parse(request.MeasurementClientId)),
            context.CancellationToken);

        return ProtoUtils.SorToResponse(sor);
    }

    public override async Task<GetSorResponse> GetMeasurementSor(GetMeasurementSorRequest request, ServerCallContext context)
    {
        var sor = await _mediator.Send(new GetMeasurementSorQuery(request.SorFileId), context.CancellationToken);

        return ProtoUtils.SorToResponse(sor);

    }

    public override async Task<EmptyResponse> StopMonitoring(StopMonitoringRequest request,
        ServerCallContext context)
    {
        var guid = Guid.Parse(request.RtuId);
        await _mediator.Send(new StopMonitoringCommand(guid), context.CancellationToken);

        // успешный результат придет в системном событии, чтобы все клиенты обработали его одинаково
        // проблемы во время исполнения должны дать кастомный exception, который пославший клиент покажет как сообщение об ошибке
        return new EmptyResponse();
    }

    // это как бы старт применения настроек
    public override async Task<ApplyMonitoringSettingsResponse> ApplyMonitoringSettings(ApplyMonitoringSettingsRequest request,
        ServerCallContext context)
    {
        var command = request.Dto.FromProto();
        var answer = await _mediator.Send(new ApplyMonitoringSettingsCommand(command), context.CancellationToken);

        return new ApplyMonitoringSettingsResponse() { Dto = answer.ToProto() };
    }

    public override async Task<AssignBaseRefsResponse> AssignBaseRefs(AssignBaseRefsRequest request, ServerCallContext context)
    {
        var dto = request.Dto.FromProto();
        var answer = await _mediator.Send(new AssignBaseRefsCommand(dto), context.CancellationToken);

        return new AssignBaseRefsResponse() { Dto = answer.ToProto() };
    }
}