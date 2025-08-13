using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetUserActionLinesQuery() : IRequest<List<LogLine>>;

public class GetUserActionLinesQueryHandler(Model writeModel) : IRequestHandler<GetUserActionLinesQuery, List<LogLine>>
{
    public Task<List<LogLine>> Handle(GetUserActionLinesQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(writeModel.UserActionsLog);
    }
}