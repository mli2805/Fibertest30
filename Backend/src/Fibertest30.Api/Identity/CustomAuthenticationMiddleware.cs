using Microsoft.AspNetCore.Authentication;

namespace Fibertest30.Api;

public class CustomAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public CustomAuthenticationMiddleware(RequestDelegate next, IAuthenticationSchemeProvider schemes)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        Schemes = schemes ?? throw new ArgumentNullException(nameof(schemes));
    } 
    
    public IAuthenticationSchemeProvider Schemes { get; set; }

    public async Task InvokeAsync(HttpContext context)
    {
        AuthenticateResult? authResult = null;

        // Authenticate by the first scheme that succeeds
        var allSchemes = await Schemes.GetAllSchemesAsync();
        foreach (var scheme in allSchemes)
        {
            authResult = await context.AuthenticateAsync(scheme.Name);
            if (authResult.Succeeded)
            {
                break;
            }
        }

        if (authResult?.Succeeded ?? false)
        {
            context.User = authResult.Principal;
        }

        await _next(context);
    }
}