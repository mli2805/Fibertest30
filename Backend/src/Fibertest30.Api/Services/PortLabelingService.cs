using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class PortLabelingService : PortLabeling.PortLabelingBase
{
    private readonly ISender _mediator;

    public PortLabelingService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<GetPortLabelsResponse> GetPortLabels(GetPortLabelsRequest request, ServerCallContext context)
    {
        var portLabels = await _mediator.Send(new GetPortLabelsQuery());
        return new GetPortLabelsResponse { PortLabels = { portLabels.Select(x => x.ToProto()) } };
    }

    public override async Task<AddAndAttachPortLabelResponse> AddAndAttachPortLabel(AddAndAttachPortLabelRequest request, ServerCallContext context)
    {
        await _mediator.Send(new AddAndAttachPortLabelCommand(request.Name, request.HexColor, request.MonitoringPortId));
        return new AddAndAttachPortLabelResponse();
    }
    
    public override async Task<UpdatePortLabelResponse> UpdatePortLabel(UpdatePortLabelRequest request, ServerCallContext context)
    {
        await _mediator.Send(new UpdatePortLabelCommand(request.PortLabelId, request.Name, request.HexColor));
        return new UpdatePortLabelResponse();
    }
    
    public override async Task<AttachPortLabelResponse> AttachPortLabel(AttachPortLabelRequest request, ServerCallContext context)
    {
        await _mediator.Send(new AttachPortLabelCommand(request.PortLabelId, request.MonitoringPortId));
        return new AttachPortLabelResponse();
    }
    
    public override async Task<DetachPortLabelAndRemoveIfLastResponse> DetachPortLabelAndRemoveIfLast(DetachPortLabelAndRemoveIfLastRequest request, ServerCallContext context)
    {
        await _mediator.Send(new DetachPortLabelCommand(request.PortLabelId, request.MonitoringPortId));
        return new DetachPortLabelAndRemoveIfLastResponse();
    }
}