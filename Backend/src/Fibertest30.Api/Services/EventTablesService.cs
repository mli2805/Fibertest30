using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class EventTablesService : EventTables.EventTablesBase
{
    private readonly ISender _mediator;

    public EventTablesService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<GetSystemEventsResponse> GetSystemEvents(GetSystemEventsRequest request, ServerCallContext context)
    {
        var systemEvents = await _mediator.Send(
            new GetSystemEventsQuery(),
            context.CancellationToken);

        var response = new GetSystemEventsResponse()
        {
            SystemEvents = { systemEvents.Select(x => x.ToProto()) }
        };

        return response;
    }

    public override async Task<GetOpticalEventsResponse> GetOpticalEvents(GetOpticalEventsRequest request,
        ServerCallContext context)
    {
        var opticalEvents =
            await _mediator.Send(new GetOpticalEventsQuery(request.CurrentEvents), context.CancellationToken);

        var response = new GetOpticalEventsResponse() { OpticalEvents = { opticalEvents.Select(x => x.ToProto()) } };

        return response;
    }

    public override async Task<GetNetworkEventsResponse> GetNetworkEvents(GetNetworkEventsRequest request,
        ServerCallContext context)
    {
        var networkEvents =
            await _mediator.Send(new GetNetworkEventsQuery(request.CurrentEvents), context.CancellationToken);

        var response = new GetNetworkEventsResponse() { NetworkEvents = { networkEvents.Select(x => x.ToProto()) } };
        return response;
    }

    public override async Task<GetBopEventsResponse> GetBopEvents(GetBopEventsRequest request,
        ServerCallContext context)
    {
        var bopEvents =
            await _mediator.Send(new GetBopEventsQuery(request.CurrentEvents), context.CancellationToken);

        var response = new GetBopEventsResponse() { BopEvents = { bopEvents.Select(x => x.ToProto()) } };
        return response;
    }

    public override async Task<GetRtuAccidentsResponse> GetRtuAccidents(GetRtuAccidentsRequest request,
        ServerCallContext context)
    {
        var rtuAccidents =
            await _mediator.Send(new GetRtuAccidentsQuery(request.CurrentAccidents), context.CancellationToken);

        var response = new GetRtuAccidentsResponse() { RtuAccidents = { rtuAccidents.Select(x => x.ToProto()) } };
        return response;
    }

    public override async Task<GetHasCurrentResponse> GetHasCurrent(GetHasCurrentRequest request,
        ServerCallContext context)
    {
        var hasCurrent = await _mediator.Send(new GetHasCurrentQuery(), context.CancellationToken);
        var response = new GetHasCurrentResponse() { HasCurrentEvents = hasCurrent.ToProto() };
        return response;
    }
}
