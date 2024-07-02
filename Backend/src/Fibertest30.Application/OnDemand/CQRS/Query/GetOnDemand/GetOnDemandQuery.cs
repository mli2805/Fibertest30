using MediatR;

namespace Fibertest30.Application;

public record GetOnDemandQuery(string OnDemandId) : IRequest<CompletedOnDemand>;

public class GetOnDemandQueryHandler : IRequestHandler<GetOnDemandQuery, CompletedOnDemand>
{
    private readonly IOnDemandRepository _onDemandRepository;

    public GetOnDemandQueryHandler(IOnDemandRepository onDemandRepository)
    {
        _onDemandRepository = onDemandRepository;
    }

    public async Task<CompletedOnDemand> Handle(GetOnDemandQuery request, CancellationToken cancellationToken)
    {
        return await _onDemandRepository.Get(request.OnDemandId);
    }
}