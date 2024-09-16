using Grpc.Core;
using Iit.Fibertest.Dto;
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

    public override async Task<DoMeasurementClientResponse> DoMeasurementClient(DoMeasurementClientRequest request,
        ServerCallContext context)
    {
        var _ = await _mediator.Send(new DoMeasurementClientCommand(request.Dto.FromProto()),
            context.CancellationToken);

        return new DoMeasurementClientResponse();
    }

    public override async Task<GetMeasurementClientSorResponse> GetMeasurementClientSor(
        GetMeasurementClientSorRequest request, ServerCallContext context)
    {
        var sor = await _mediator.Send(new GetMeasurementClientSorQuery(Guid.Parse(request.MeasurementClientId)),
            context.CancellationToken);

        return new GetMeasurementClientSorResponse()
        {
            Sor = ProtoUtils.MeasurementTraceToSorByteString(sor, request.VxsorFormat)
        };
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
}