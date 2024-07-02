using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Fibertest30.Api;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId => _httpContextAccessor.HttpContext?.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
    public string? UserName => _httpContextAccessor.HttpContext?.User.FindFirstValue(JwtRegisteredClaimNames.Name);
    public string? Role => _httpContextAccessor.HttpContext?.User.FindFirstValue(ApplicationClaims.Role);
}