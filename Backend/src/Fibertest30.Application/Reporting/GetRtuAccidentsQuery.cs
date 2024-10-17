using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;
public record GetRtuAccidentsQuery(bool Current) : IRequest<List<RtuAccidentDto>>;

public class GetRtuAccidentsQueryHandler : IRequestHandler<GetRtuAccidentsQuery, List<RtuAccidentDto>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly TableProvider _tableProvider;

    public GetRtuAccidentsQueryHandler(ICurrentUserService currentUserService, TableProvider tableProvider)
    {
        _currentUserService = currentUserService;
        _tableProvider = tableProvider;
    }

    public Task<List<RtuAccidentDto>> Handle(GetRtuAccidentsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var portion = _tableProvider.GetRtuAccidents(Guid.Parse(userId!), request.Current);
        return Task.FromResult(portion);
    }
}

