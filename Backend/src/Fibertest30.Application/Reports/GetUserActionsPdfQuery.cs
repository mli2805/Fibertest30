using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetUserActionsPdfQuery(Guid UserId, DateTimeFilter DateTimeFilter, List<int> OperationCodes) :
    IRequest<byte[]>;

public class GetUserActionsPdfQueryHandler(Model writeModel, IUsersRepository usersRepository, 
    IUserSettingsRepository userSettingsRepository, ICurrentUserService currentUserService, IPdfBuilder pdfBuilder) :
    IRequestHandler<GetUserActionsPdfQuery, byte[]>
{
    public async Task<byte[]> Handle(GetUserActionsPdfQuery request, CancellationToken cancellationToken)
    {
        var users = await usersRepository.GetAllUsers();

        var lines = writeModel
            .GetFilteredUserActions(users, request.UserId, request.DateTimeFilter, request.OperationCodes);

        var userId = currentUserService.UserId!;
        var userSettings = await userSettingsRepository.GetUserSettings(userId);

        var bytes = pdfBuilder.GenerateUserActionsReport(lines, userSettings?.GetCulture() ?? "ru-RU");
        if (bytes == null)
            throw new InvalidDataException("FailedToGenerateReport");

        return bytes;
    }
}