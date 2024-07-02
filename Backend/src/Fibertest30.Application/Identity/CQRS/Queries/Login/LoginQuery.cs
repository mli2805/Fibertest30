
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

[AllowAnonymous]
public record LoginQuery(string UserName, string Password) : IRequest<AuthenticationResult>;

public class LoginHandler : IRequestHandler<LoginQuery, AuthenticationResult>
{
    private readonly IJwtTokenGenerator _tokenGenerator;
    private readonly IUserRolePermissionProvider _permissionProvider;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUserSettingsRepository _userSettingsRepository;

    public LoginHandler(
            IJwtTokenGenerator tokenGenerator,
            IUserRolePermissionProvider permissionProvider,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IUserSettingsRepository userSettingsRepository)
    {
        _tokenGenerator = tokenGenerator;
        _permissionProvider = permissionProvider;
        _signInManager = signInManager;
        _userManager = userManager;
        _userSettingsRepository = userSettingsRepository;
    }

    public async Task<AuthenticationResult> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var userName = request.UserName;
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null) { return ForbidLogin(); }

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!signInResult.Succeeded) { return ForbidLogin(); }

        var token = await _tokenGenerator.GenerateToken(user);
        var role = await _permissionProvider.GetUserSingleRole(user);
        var permissions = (await _permissionProvider.GetUserPermissions(user))
            .Select(x => x.ToString()).ToList();
        
        var userSettings = await _userSettingsRepository.GetUserSettings(user.Id);
        return new AuthenticationResult(true, token, new AuthenticatedUser(role, user), userSettings);
    }

    private AuthenticationResult ForbidLogin()
    {
        return new AuthenticationResult(false, string.Empty, null, null);
    }
}
