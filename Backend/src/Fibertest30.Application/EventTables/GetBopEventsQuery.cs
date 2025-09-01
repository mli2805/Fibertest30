using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;
public record GetBopEventsQuery(bool Current, DateTimeFilter DateTimeFilter, int PortionSize) : IRequest<List<BopEventDto>>;

public class GetBopEventsQueryHandler(ICurrentUserService currentUserService, 
    IUsersRepository usersRepository, TableProvider tableProvider)
    : IRequestHandler<GetBopEventsQuery, List<BopEventDto>>
{
    public async Task<List<BopEventDto>> Handle(GetBopEventsQuery request, CancellationToken cancellationToken)
    {
        var user = await usersRepository.GetUserById(currentUserService.UserId!);
        var portion = tableProvider
            .GetBopEvents(user.User.ZoneId, request.Current, request.DateTimeFilter, request.PortionSize);
        return portion;
    }
}

