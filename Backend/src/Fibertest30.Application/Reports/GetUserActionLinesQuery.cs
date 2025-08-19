using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetUserActionLinesQuery(Guid UserId, DateTimeFilter DateTimeFilter, List<int> OperationCodes) : IRequest<List<LogLine>>;

public class GetUserActionLinesQueryHandler(Model writeModel, IPdfBuilder pdfBuilder) : IRequestHandler<GetUserActionLinesQuery, List<LogLine>>
{
    public Task<List<LogLine>> Handle(GetUserActionLinesQuery request, CancellationToken cancellationToken)
    {
        var lines = writeModel.GetFilteredUserActions(request.UserId, request.DateTimeFilter, request.OperationCodes);

        return Task.FromResult(lines);
    }
}

public static class UserActionsExt
{
    public static List<LogLine> GetFilteredUserActions(this Model writeModel, 
        Guid userId, DateTimeFilter dateTimeFilter, List<int> operationCodes)
    {
        // фильтрацию по пользователям позже

        // date: по  SearchWindow
        var period = dateTimeFilter.SearchWindow!;
        var logOfPeriod = writeModel.UserActionsLog
            .Where(l => l.Timestamp >= period.Start && l.Timestamp <= period.End);

        var lines = logOfPeriod.Where(l => operationCodes.Contains((int)l.OperationCode));
        return lines.ToList();

    }
}