
namespace Fibertest30.Infrastructure;

public class JwtSettings
{
    public const string SectionName = "JwtSettings";

    public string Issuer { get; init ; } = null!;
    public string Audience { get; init; } = null!;
    public int ExpireMinutes { get; init; }
    public string Secretkey { get; init; } = null!;
}
