namespace Fibertest30.Application;

public interface IJwtTokenGenerator
{
    Task<string> GenerateToken(ApplicationUser user);
}
