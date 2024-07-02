using MediatR;

namespace Fibertest30.Application;

public record GetBaselineLinkmapQuery(int BaselineId, double MacrobendThreshold) : IRequest<byte[]?>;

public class GetBaselineLinkmapQueryHandler : IRequestHandler<GetBaselineLinkmapQuery, byte[]?>
{
    private readonly IBaselineRepository _baselineRepository;
    private readonly ILinkmapGenerator _linkmapGenerator;
    
    public GetBaselineLinkmapQueryHandler(IBaselineRepository baselineRepository, ILinkmapGenerator linkmapGenerator)
    {
        _baselineRepository = baselineRepository;
        _linkmapGenerator = linkmapGenerator;
    }

    public async Task<byte[]?> Handle(GetBaselineLinkmapQuery request, CancellationToken ct)
    {
        var sorBytes = await _baselineRepository.GetSor(request.BaselineId, ct);
        if (sorBytes == null) return null;

        var lmapBytes = await _linkmapGenerator.GenerateLinkmap(new List<byte[]> { sorBytes }, request.MacrobendThreshold);
        return lmapBytes;
    }
}