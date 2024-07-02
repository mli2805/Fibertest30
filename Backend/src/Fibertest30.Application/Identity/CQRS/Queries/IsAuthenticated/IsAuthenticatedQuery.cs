using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

[AllowAnonymous]
public record IsAuthenticatedQuery() : IRequest<bool>;

public class IsAuthenticatedQueryHandler : IRequestHandler<IsAuthenticatedQuery, bool>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly UserManager<ApplicationUser> _userManager;

    public IsAuthenticatedQueryHandler(ICurrentUserService currentUserService,
        UserManager<ApplicationUser> userManager)
    {
        _currentUserService = currentUserService;
        _userManager = userManager;
    }

    public async Task<bool> Handle(IsAuthenticatedQuery request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId != null)
        {
            var user = await _userManager.FindByIdAsync(_currentUserService.UserId!);
            if (user == null)
            {
                // The token is valid, but no user?
                // Probably just switched to another server, or user was deleted
                return false;
            }
        }
        
        var isAuthenticated = _currentUserService.UserId != null;
        return isAuthenticated;
    }
}