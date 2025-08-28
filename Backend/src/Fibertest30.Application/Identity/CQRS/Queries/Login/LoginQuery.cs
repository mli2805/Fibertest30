
using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

[AllowAnonymous]
public record LoginQuery(string UserName, string Password, string ClientIp) : IRequest<AuthenticationResult>;

public class LoginHandler(
    IJwtTokenGenerator tokenGenerator,
    IUserRolePermissionProvider permissionProvider,
    SignInManager<ApplicationUser> signInManager,
    UserManager<ApplicationUser> userManager,
    IUserSettingsRepository userSettingsRepository,
    IEventStoreService eventStoreService)
    : IRequestHandler<LoginQuery, AuthenticationResult>
{
    public async Task<AuthenticationResult> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var userName = request.UserName;
        var user = await userManager.FindByNameAsync(userName);
        if (user == null) { return ForbidLogin(); }

        var signInResult = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!signInResult.Succeeded) { return ForbidLogin(); }

        var token = await tokenGenerator.GenerateToken(user);
        var role = await permissionProvider.GetUserSingleRole(user);
        
        var userSettings = await userSettingsRepository.GetUserSettings(user.Id);

        var command = new RegisterClientStation() { RegistrationResult = ReturnCode.ClientRegisteredSuccessfully };
        await eventStoreService.SendCommand(command, userName, request.ClientIp);

        return new AuthenticationResult(true, token, new AuthenticatedUser(role, user), userSettings);
    }

    private AuthenticationResult ForbidLogin()
    {
        return new AuthenticationResult(false, string.Empty, null, null);
    }
}
