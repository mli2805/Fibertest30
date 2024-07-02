using MediatR;

namespace Fibertest30.Application;

public record GetOnDemandsQuery(List<int> PortIds) : IRequest<List<CompletedOnDemand>>;

public class GetOnDemandsQueryHandler : IRequestHandler<GetOnDemandsQuery, List<CompletedOnDemand>>
{
    private readonly IOnDemandRepository _onDemandRepository;

    public GetOnDemandsQueryHandler(IOnDemandRepository onDemandRepository)
    {
        _onDemandRepository = onDemandRepository;
    }

    public async Task<List<CompletedOnDemand>> Handle(GetOnDemandsQuery request, CancellationToken cancellationToken)
    {
        return await _onDemandRepository.GetAll(request.PortIds, sortDescending: true);
    }
}