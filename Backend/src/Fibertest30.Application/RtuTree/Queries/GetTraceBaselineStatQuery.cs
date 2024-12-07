using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetTraceBaselineStatQuery(Guid TraceId) : IRequest<List<BaselineStat>>;

public class GetTraceBaselineStatQueryHandler : IRequestHandler<GetTraceBaselineStatQuery, List<BaselineStat>>
{
    private readonly Model _writeModel;

    public GetTraceBaselineStatQueryHandler(Model writeModel)
    {
        _writeModel = writeModel;
    }

    public Task<List<BaselineStat>> Handle(GetTraceBaselineStatQuery request, CancellationToken cancellationToken)
    {
        var baselineStats = _writeModel.BaseRefs
            .Where(t => t.TraceId == request.TraceId)
            .Select(b => new BaselineStat()
            {
                SorFileId = b.SorFileId,
                BaseRefType = b.BaseRefType,
                AssignedAt = b.SaveTimestamp,
                ByUser = b.UserName
            }).ToList();

        return Task.FromResult(baselineStats);
    }
}

