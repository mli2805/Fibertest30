using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetOpticalEventsQuery(bool Current, DateTimeFilter DateTimeFilter, int PortionSize) : IRequest<List<OpticalEventDto>>;

public class GetOpticalEventsQueryHandler(ICurrentUserService currentUserService, 
    IUsersRepository usersRepository, TableProvider tableProvider)
    : IRequestHandler<GetOpticalEventsQuery, List<OpticalEventDto>>
{
    public async Task<List<OpticalEventDto>> Handle(GetOpticalEventsQuery request, CancellationToken cancellationToken)
    {
        var user = await usersRepository.GetUserById(currentUserService.UserId!);
        var portion = tableProvider
            .GetOpticalEvents(user.User.ZoneId, request.Current, request.DateTimeFilter, request.PortionSize);
        return portion;
    }
}
