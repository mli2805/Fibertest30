using Lib.AspNetCore.ServerSentEvents;
using Fibertest30.Infrastructure.Emulator;

namespace Fibertest30.Api;

public static class ConfigureEmulatorServices
{
    public static void TryAddEmulatorServices(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("Emulator:Enabled"))
        {
            services.AddServerSentEvents();
            services.AddSingleton<EmulatorSsePublisher, EmulatorSsePublisher>();
        }
    }
    
    public static void TryStartEmulatorServices(this WebApplication app)
    {
       OtauEmulatorProvider otauProvider = new();
       OtauEmulatorPortChangesProvider portChangesProvider = new();
        
        if (app.Configuration.GetValue<bool>("Emulator:Enabled"))
        {
            app.MapGet("/emulator/otau", () =>
            {
                var otauConfig = otauProvider.ReadConfig();
                return Results.Content(otauConfig, "application/json");
            }).RequireCors("AllowAll");

            app.MapPost("/emulator/otau", async (HttpRequest req) =>
            {
                using (var reader = new StreamReader(req.Body, System.Text.Encoding.UTF8))
                {
                    var otauConfig = await reader.ReadToEndAsync();
                    otauProvider.WriteConfig(otauConfig);
                }

                return Results.Accepted();
            }).RequireCors("AllowAll");
            
            app.MapGet("/emulator/otau-port-changes", () =>
            {
                var config = portChangesProvider.ReadConfig();
                return Results.Content(config, "application/json");
            }).RequireCors("AllowAll");
            
            app.MapPost("/emulator/otau-port-changes", async (HttpRequest req) =>
            {
                using (var reader = new StreamReader(req.Body, System.Text.Encoding.UTF8))
                {
                    var config = await reader.ReadToEndAsync();
                    portChangesProvider.WriteConfig(config);
                }
                return Results.Accepted();
            }).RequireCors("AllowAll");
            
           
            app.MapServerSentEvents("/emulator/sse")
                .RequireCors("AllowAll");
        }
    }
}