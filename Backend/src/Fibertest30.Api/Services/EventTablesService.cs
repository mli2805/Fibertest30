using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class EventTablesService(ISender mediator) : EventTables.EventTablesBase
{
    public override async Task<GetSystemEventsResponse> GetSystemEvents(GetSystemEventsRequest request, ServerCallContext context)
    {
        var systemEvents = await mediator.Send(
            new GetSystemEventsQuery(),
            context.CancellationToken);

        var response = new GetSystemEventsResponse()
        {
            SystemEvents = { systemEvents.Select(x => x.ToProto()) }
        };

        return response;
    }

    public override async Task<GetOpticalEventResponse> GetOpticalEvent(GetOpticalEventRequest request, ServerCallContext context)
    {
        var opticalEvent = await mediator.Send(new GetOpticalEventQuery(request.EventId), context.CancellationToken);
        var response = new GetOpticalEventResponse() { OpticalEvent = opticalEvent.ToProto() };
        return response;
    }

    public override async Task<GetOpticalEventsResponse> GetOpticalEvents(GetOpticalEventsRequest request,
        ServerCallContext context)
    {
        var opticalEvents =
            await mediator.Send(new GetOpticalEventsQuery(
                request.CurrentEvents, request.DateTimeFilter.FromProto(), request.PortionSize), context.CancellationToken);

        var response = new GetOpticalEventsResponse() { OpticalEvents = { opticalEvents.Select(x => x.ToProto()) } };

        return response;
    }

    public override async Task<GetNetworkEventResponse> GetNetworkEvent(GetNetworkEventRequest request, ServerCallContext context)
    {
        var networkEvent = await mediator.Send(new GetNetworkEventQuery(request.EventId), context.CancellationToken);
        return new GetNetworkEventResponse() { NetworkEvent = networkEvent.ToProto() };
    }

    public override async Task<GetNetworkEventsResponse> GetNetworkEvents(GetNetworkEventsRequest request,
        ServerCallContext context)
    {
        var networkEvents =
            await mediator.Send(new GetNetworkEventsQuery(
                    request.CurrentEvents, request.DateTimeFilter.FromProto(), request.PortionSize),
                context.CancellationToken);

        var response = new GetNetworkEventsResponse() { NetworkEvents = { networkEvents.Select(x => x.ToProto()) } };
        return response;
    }

    public override async Task<GetBopEventResponse> GetBopEvent(GetBopEventRequest request, ServerCallContext context)
    {
        var bopEvent = await mediator.Send(new GetBopEventQuery(request.EventId), context.CancellationToken);
        return new GetBopEventResponse() { BopEvent = bopEvent.ToProto() };
    }

    public override async Task<GetBopEventsResponse> GetBopEvents(GetBopEventsRequest request,
        ServerCallContext context)
    {
        var bopEvents =
            await mediator.Send(new GetBopEventsQuery(
                request.CurrentEvents, request.DateTimeFilter.FromProto(), request.PortionSize), context.CancellationToken);

        var response = new GetBopEventsResponse() { BopEvents = { bopEvents.Select(x => x.ToProto()) } };
        return response;
    }

    public override async Task<GetRtuAccidentResponse> GetRtuAccident(GetRtuAccidentRequest request, ServerCallContext context)
    {
        var rtuAccident = await mediator.Send(new GetRtuAccidentQuery(request.EventId), context.CancellationToken);
        return new GetRtuAccidentResponse() { RtuAccident = rtuAccident.ToProto() };
    }

    public override async Task<GetRtuAccidentsResponse> GetRtuAccidents(GetRtuAccidentsRequest request,
        ServerCallContext context)
    {
        var rtuAccidents =
            await mediator.Send(new GetRtuAccidentsQuery(
                request.CurrentAccidents, request.DateTimeFilter.FromProto(), request.PortionSize),
                context.CancellationToken);

        var response = new GetRtuAccidentsResponse() { RtuAccidents = { rtuAccidents.Select(x => x.ToProto()) } };
        return response;
    }

    public override async Task<GetHasCurrentResponse> GetHasCurrent(GetHasCurrentRequest request,
        ServerCallContext context)
    {
        var hasCurrent = await mediator.Send(new GetHasCurrentQuery(), context.CancellationToken);
        var response = new GetHasCurrentResponse() { HasCurrentEvents = hasCurrent.ToProto() };
        return response;
    }
}
