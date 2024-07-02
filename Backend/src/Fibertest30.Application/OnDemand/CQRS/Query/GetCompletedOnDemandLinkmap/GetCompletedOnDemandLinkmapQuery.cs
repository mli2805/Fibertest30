using MediatR;

namespace Fibertest30.Application;

public record GetCompletedOnDemandLinkmapQuery(string OnDemandId, double MacrobendThreshold) : IRequest<byte[]?>;

public class GetCompletedOnDemandLinkmapQueryHandler : IRequestHandler<GetCompletedOnDemandLinkmapQuery, byte[]?>
{
    private readonly IOnDemandRepository _onDemandRepository;
    private readonly ILinkmapGenerator _linkmapGenerator;

    public GetCompletedOnDemandLinkmapQueryHandler(IOnDemandRepository onDemandRepository, ILinkmapGenerator linkmapGenerator)
    {
        _onDemandRepository = onDemandRepository;
        _linkmapGenerator = linkmapGenerator;
    }

    public async Task<byte[]?> Handle(GetCompletedOnDemandLinkmapQuery request,
        CancellationToken cancellationToken)
    {
        var sorBytes = await _onDemandRepository.GetSor(request.OnDemandId);
        if (sorBytes == null) return null;

        var lmapBytes = await _linkmapGenerator.GenerateLinkmap(new List<byte[]> { sorBytes }, request.MacrobendThreshold);
        return lmapBytes;
    }
}