using MediatR;

namespace Fibertest30.Application;

public record GetPortLabelsQuery() : IRequest<List<PortLabel>>;

public class GetPortLabelsQueryHandler : IRequestHandler<GetPortLabelsQuery, List<PortLabel>>
{
    private readonly IPortLabelRepository _portLabelRepository;

    public GetPortLabelsQueryHandler(IPortLabelRepository portLabelRepository)
    {
        _portLabelRepository = portLabelRepository;
    }

    public async Task<List<PortLabel>> Handle(GetPortLabelsQuery request, CancellationToken ct)
    {
        var portLabels = await _portLabelRepository.GetAll(ct);
        return portLabels;
    }
}