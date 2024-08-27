using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Application;

public record RefreshTokenQuery : IRequest<string>;

public class RefreshTokenQueryHandler : IRequestHandler<RefreshTokenQuery, string>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtTokenGenerator _tokenGenerator;

    public RefreshTokenQueryHandler(
        ICurrentUserService currentUserService,
        UserManager<ApplicationUser> userManager,
        IJwtTokenGenerator tokenGenerator)
    {
        _currentUserService = currentUserService;
        _userManager = userManager;
        _tokenGenerator = tokenGenerator;
    }

    public async Task<string> Handle(RefreshTokenQuery request, CancellationToken cancellationToken)
    {
        // User can't call this without being authenticated, so userId should never be null
        var userId = _currentUserService.UserId!;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new Exception($"Can't refresh token for userId={userId}");
        }
        
        var token = await _tokenGenerator.GenerateToken(user);
        return token;
    }
}