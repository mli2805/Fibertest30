
using Microsoft.AspNetCore.Identity;

namespace Fibertest30.Infrastructure;

public static class IdentityOptionsConfiguration
{
    public static void Configure(IdentityOptions options)
    {
        options.Password.RequireDigit = true;
        options.Password.RequireNonAlphanumeric = true;
    }
}
