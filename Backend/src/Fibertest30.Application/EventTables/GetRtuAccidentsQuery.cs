using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;
public record GetRtuAccidentsQuery(bool Current, DateTimeFilter DateTimeFilter, int PortionSize) : IRequest<List<RtuAccidentDto>>;

public class GetRtuAccidentsQueryHandler(ICurrentUserService currentUserService,
    IUsersRepository usersRepository, TableProvider tableProvider)
    : IRequestHandler<GetRtuAccidentsQuery, List<RtuAccidentDto>>
{
    public async Task<List<RtuAccidentDto>> Handle(GetRtuAccidentsQuery request, CancellationToken cancellationToken)
    {
        var user = await usersRepository.GetUserById(currentUserService.UserId!);
        var portion = tableProvider
            .GetRtuAccidents(user.User.ZoneId, request.Current, request.DateTimeFilter, request.PortionSize);
        return portion;
    }
}

