using MediatR;

namespace Fibertest30.Application;

public record GetFiberInfoQuery(Guid FiberId) : IRequest<FiberInfo>;

public class GetFiberInfoQueryHandler(FiberInfoProvider fiberInfoProvider) : IRequestHandler<GetFiberInfoQuery, FiberInfo>
{
    public async Task<FiberInfo> Handle(GetFiberInfoQuery request, CancellationToken cancellationToken)
    {
        var fiberInfo = await fiberInfoProvider.GetFiberInfo(request.FiberId);
        return fiberInfo;
    }
}