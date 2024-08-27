using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

public record GetCurrentUserQuery : IRequest<CurrentUser>;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, CurrentUser>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserRolePermissionProvider _permissionProvider;
    private readonly IUserSettingsRepository _userSettingsRepository;

    public GetCurrentUserQueryHandler(
        ICurrentUserService currentUserService,
        UserManager<ApplicationUser> userManager,
        IUserRolePermissionProvider permissionProvider,
        IUserSettingsRepository userSettingsRepository)
    {
        _currentUserService = currentUserService;
        _userManager = userManager;
        _permissionProvider = permissionProvider;
        _userSettingsRepository = userSettingsRepository;
    }

    public async Task<CurrentUser> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId!;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            // User can be authenticated by external identity provider
            // in this case user does not exists in our database
            // And is shouldn't refresh external token using this API
            throw new Exception($"Can't get current user for userId={userId}");
        }
        
        var role = await _permissionProvider.GetUserSingleRole(user);
        var userSettings = await _userSettingsRepository.GetUserSettings(userId);

        var authUser = new AuthenticatedUser(role, user);
        return new CurrentUser(authUser, userSettings);
    }
}