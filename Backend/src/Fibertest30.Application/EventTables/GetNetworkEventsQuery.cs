using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetNetworkEventsQuery(bool Current, DateTimeFilter DateTimeFilter, int PortionSize) : IRequest<List<NetworkEventDto>>;

public class GetNetworkEventsQueryHandler(ICurrentUserService currentUserService, 
    IUsersRepository usersRepository, TableProvider tableProvider)
    : IRequestHandler<GetNetworkEventsQuery, List<NetworkEventDto>>
{
    public async Task<List<NetworkEventDto>> Handle(GetNetworkEventsQuery request, CancellationToken cancellationToken)
    {
        var user = await usersRepository.GetUserById(currentUserService.UserId!);
        var portion = tableProvider
            .GetNetworkEvents(user.User.ZoneId, request.Current, request.DateTimeFilter, request.PortionSize);
        return portion;
    }
}

