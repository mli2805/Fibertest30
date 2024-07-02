using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Fibertest30.Api;

public static class ConfigureServices
{
    private const string LocalAuthScheme = "BearerLocal";
    private const string ExternalAuthScheme = "BearerExternal";
    
    public static IServiceCollection AddPresentationServices(
        this IServiceCollection services,
        IConfiguration configuration,
        string environmentName)
    {
        services.AddAuthentication(configuration, environmentName);

        services.AddGrpc(options =>
        {
            options.Interceptors.Add<ExceptionInterceptor>();
        });

        services.AddGrpcReflection();

        services.AddCors(o => o.AddPolicy("AllowAll", builder =>
        {
            builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding");
        }));

        return services;
    }

    private static void AddAuthentication(
        this IServiceCollection services, 
        IConfiguration configuration,
        string environmentName)
    {
        var jwtSettings = configuration.GetRequiredSection(JwtSettings.SectionName).Get<JwtSettings>()!;

        // NOTE:
        // We use custom authentication middleware: CustomAuthenticationMiddleware
        // and custom authorization middleware: AuthorizationBehaviour (MediatR pipeline)
         var authenticationBuilder = services.AddAuthentication();
        authenticationBuilder.AddLocalAuthentication(jwtSettings, environmentName);
        authenticationBuilder.AddExternalAuthentication();
    }

    private static void AddLocalAuthentication(
        this AuthenticationBuilder authenticationBuilder, 
        JwtSettings jwtSettings,
        string environmentName)
    {
        authenticationBuilder.AddJwtBearer(LocalAuthScheme, options =>
        {
            // TODO: Consider moving setup to JwtBearerOptionsSetup : IConfigureOptions<JwtBearerOptions>
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secretkey)),
                // We generate & validate token using the same clock (currently there is no external IdP)
                // Let's reset ClockSkew to simplify testing tokens (especially those with short expiration times)
                
                ClockSkew = TimeSpan.FromSeconds(60*5)
            };

            if (environmentName == "Test")
            {
                // Disable token lifetime validation in test environment
                // because we can't control time in JwtSecurityTokenHandler.Validate
                options.TokenValidationParameters.ValidateLifetime = false;
            }
        });
    }

    private static void AddExternalAuthentication(this AuthenticationBuilder authenticationBuilder)
    {
        // TODO: load external OIDC identity provider settings from configuration
        
        authenticationBuilder.AddJwtBearer(ExternalAuthScheme, options =>
        {
            options.Authority = "http://192.168.96.24:8080/realms/master";
            options.MetadataAddress = "http://192.168.96.24:8080/realms/master/.well-known/openid-configuration";
            options.RequireHttpsMetadata = false;
    
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = "http://192.168.96.24:8080/realms/master",
                ValidAudience = "account",
            };
        });
    }
}