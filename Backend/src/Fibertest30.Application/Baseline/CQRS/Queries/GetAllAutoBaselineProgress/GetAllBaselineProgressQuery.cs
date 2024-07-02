using MediatR;

namespace Fibertest30.Application;

public record GetAllBaselineProgressQuery() : IRequest<List<OtdrTaskProgressData>>;

public class GetAllBaselineProgressQueryHandler : IRequestHandler<GetAllBaselineProgressQuery, List<OtdrTaskProgressData>>
{
    private readonly IBaselineSetupService _baselineSetupService;

    public GetAllBaselineProgressQueryHandler(
        IBaselineSetupService baselineSetupService)
    {
        _baselineSetupService = baselineSetupService;
    }

    public async Task<List<OtdrTaskProgressData>> Handle(GetAllBaselineProgressQuery request, CancellationToken ct)
    {
        return await _baselineSetupService.GetAllBaselineProgress();
    }
}