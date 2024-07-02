
namespace Fibertest30.Application;

public interface ICurrentUserService
{
    public string? UserId { get; }
    public string? Role { get; }
    public string? UserName { get; }
}
