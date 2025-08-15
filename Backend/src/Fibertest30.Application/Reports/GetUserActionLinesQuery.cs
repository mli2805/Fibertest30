using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetUserActionLinesQuery(Guid UserId, DateTimeFilter DateTimeFilter, List<int> OperationCodes) : IRequest<List<LogLine>>;

public class GetUserActionLinesQueryHandler(Model writeModel) : IRequestHandler<GetUserActionLinesQuery, List<LogLine>>
{
    public Task<List<LogLine>> Handle(GetUserActionLinesQuery request, CancellationToken cancellationToken)
    {
        // фильтрацию по пользователям позже

        // date: по  SearchWindow
        var period = request.DateTimeFilter.SearchWindow!;
        var logOfPeriod = writeModel.UserActionsLog
            .Where(l => l.Timestamp >= period.Start && l.Timestamp <= period.End);

        var lines = logOfPeriod.Where(l => request.OperationCodes.Contains((int)l.OperationCode));

        return Task.FromResult(lines.ToList());
    }
}