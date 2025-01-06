using Destructurama;
using Fibertest30.Api;
using Fibertest30.HtmlTemplates;
using Serilog;
using Serilog.Sinks.Elasticsearch;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using EmailServer = Fibertest30.Application.EmailServer;
using TrapReceiver = Fibertest30.Application.TrapReceiver;

try
{
    var startupStopwatch = Stopwatch.StartNew();

    var builder = WebApplication.CreateBuilder(args);
    // should be called before log configuration
    SetCurrentDirectoryAndCreateDataDirectory(builder);

    Log.Logger = CreateLogger(builder);
    Log.Information("-----------------------------------------------------------------------");
    Log.Information("Starting Fibertest v{Version}", new VersionProvider().GetApiVersion());

    builder.Host.UseSerilog(Log.Logger);
    builder.Services.AddApplicationServices();
    builder.Services.AddInfrastructureServices(builder.Configuration, builder.Environment.EnvironmentName);
    builder.Services.AddPresentationServices(builder.Configuration, builder.Environment.EnvironmentName);
    builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
    builder.Services.AddScoped<WarmupService, WarmupService>();
    builder.Services.AddSingleton<IVersionProvider, VersionProvider>();

    builder.Services.AddHostedService<SystemEventBackgroundService>();
    builder.Services.AddHostedService<NotificationBackgroundService>();
    builder.Services.AddHostedService<RtuDataProcessorBackgroundService>();
    builder.Services.AddHostedService<RtuPollsterBackgroundService>();

    builder.Services.AddScoped<IEmailBodyBuilder, EmailBodyBuilder>();
    builder.Services.AddScoped<ISnmpContentBuilder, SnmpContentBuilder>();

    builder.Services.AddPrometheusHttpClient(builder.Configuration);

    var app = builder.Build();

    // warmup after app started in production 
    if (app.Environment.IsProduction())
    {
        app.Lifetime.ApplicationStarted.Register(() =>
        {
            Task.Run(async () =>
            {
                using var scope = app.Services.CreateScope();
                var warmupService = scope.ServiceProvider.GetRequiredService<WarmupService>();
                await warmupService.Execute();
            });
        });
    }

    app.Lifetime.ApplicationStarted.Register(() =>
    {
        startupStopwatch.Stop();
        Log.Information("Startup finished in {ElapsedMilliseconds} ms", startupStopwatch.ElapsedMilliseconds);
    });

    // graceful shutdown
    app.Lifetime.ApplicationStopping.Register(async () =>
    {
        var inAppChannelSender = app.Services.GetRequiredService<IInAppChannelSender>();
        Log.Information("InAddChannel: Stopping..");
        await inAppChannelSender.DisposeAllObservers(); // Note Register do not wait!
        Log.Information("InAddChannel: Stopped");
    });

    Log.Information("Initialize and seed database..");
    using (var scope = app.Services.CreateScope())
    {
        var initializer = scope.ServiceProvider.GetRequiredService<RtuContextInitializer>();
        await initializer.InitialiseAsync();

        var emulator = builder.Configuration.GetValue<bool>("Emulator:Enabled");
        var seedDemoOtaus = emulator ? "all" : string.Empty;
        await initializer.SeedAsync(seedDemoOtaus, seedDemoUsers: emulator);
    }

    Log.Information("Initialize and seed MySql FtDb ..");
    using (var scope = app.Services.CreateScope())
    {
        var ftDbInitializer = scope.ServiceProvider.GetRequiredService<FtDbContextInitializer>();
        await ftDbInitializer.InitializeAsync();
    }
    Log.Information("Initialize and seed NEventStore ..");
    using (var scope = app.Services.CreateScope())
    {
        var eventStoreService = scope.ServiceProvider.GetRequiredService<IEventStoreService>();
        await eventStoreService.InitializeBothDbAndService();
    }

    app.UseRouting();
    app.UseGrpcWeb(); // Must be added between UseRouting and UseEndpoints
    app.UseCors();

    JwtSecurityTokenHandler.DefaultInboundClaimTypeMap
        .Clear(); // forbid Microsoft Identity to override claim names
    app.UseMiddleware<CustomAuthenticationMiddleware>();
    // app.UseAuthentication(); // Authentication middleware is in CustomAuthenticationMiddleware
    // app.UseAuthorization();  // Authorization middleware is in MediatR AuthorizationBehavior

    MapGrpcServices(app, builder.Configuration.GetValue<bool>("StartGrpcReflectionService"));

    app.MapGet("/",
        () =>
            "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");
    app.Run();
    return 0;
}
catch (HostAbortedException)
{
    // Prevent showing HostAbortedException when working with ef migration / ef database:
    // for example, the command: dotnet ef migrations list --project Fibertest30.Infrastructure --startup-project Fibertest30.Api
    // https://github.com/dotnet/efcore/issues/29809
    return 1;
}
catch (Exception ex)
{
    Log.Fatal(ex, "An unhandled exception occurred during bootstrapping");
    return 1;
}
finally
{
    Log.CloseAndFlush();
}



Serilog.Core.Logger CreateLogger(WebApplicationBuilder builder)
{
    // Serilog.Debugging.SelfLog.Enable(Console.Error);

    var loggerConfig = CreateLoggerConfiguration(builder);

    var url = builder.Configuration.GetValue<string>("Elasticsearch:Url");
    var indexPrefix = builder.Configuration.GetValue<string>("Elasticsearch:IndexPrefix");
    if (!string.IsNullOrEmpty(url) && !string.IsNullOrEmpty(indexPrefix))
    {
        loggerConfig.WriteTo.Elasticsearch(new ElasticsearchSinkOptions(
            new Uri(url))
        {
            AutoRegisterTemplate = true,
            IndexFormat = indexPrefix + "-{0:yyyy.MM}",
            // our demo ELK contains self-signed certificate, so ignore certificate validation
            // Consider to activate it conditionally, if ELK will be used in production
            ModifyConnectionSettings = configuration => configuration.ServerCertificateValidationCallback(
                (_, _, _, _) => true),
        });
    }

    var logger = loggerConfig.CreateLogger();
    return logger;
}

LoggerConfiguration CreateLoggerConfiguration(WebApplicationBuilder builder)
{
    return new LoggerConfiguration()
        .Destructure.ByIgnoringProperties<LoginQuery>(u => u.Password)
        .Destructure.ByIgnoringProperties<EmailServer>(c => c.ServerPassword)
        .Destructure.ByIgnoringProperties<TrapReceiver>(c => c.AuthenticationPassword)
        .Destructure.ByIgnoringProperties<TrapReceiver>(c => c.PrivacyPassword)
        .ReadFrom.Configuration(builder.Configuration);
}

void SetCurrentDirectoryAndCreateDataDirectory(WebApplicationBuilder builder)
{
    if (builder.Environment.IsEnvironment("Test"))
    {
        // don't need to create data directory for functional tests
        // everything should be in memory
        return;
    }

    // By default Visual Studio sets current directory of .NET Core Web projects (including Api)
    // to the /app directory. This could be handy if there are some CSS or JS files
    // which user can change using Visual Studio and expect to see the result in browser immediately.
    // As a consequence of this, the serilog's log folder appear at /app directory as well as sqlite db.

    // We don't need to edit anything on the fly on our Api project, so 
    // let's change the current directory to project output directory.
    var assemblyLocation = AppContext.BaseDirectory;
    Directory.SetCurrentDirectory(Path.GetDirectoryName(assemblyLocation)!);

    // Create a directory for stored data (like sqlite database)
    Directory.CreateDirectory("data");
}


void MapGrpcServices(WebApplication app, bool startGrpcReflectionService)
{
    app.MapGrpcService<CoreService>()
        .EnableGrpcWeb()
        .RequireCors("AllowAll");

    app.MapGrpcService<IdentityService>()
        .EnableGrpcWeb()
        .RequireCors("AllowAll");

    app.MapGrpcService<MeasurementService>()
        .EnableGrpcWeb()
        .RequireCors("AllowAll");

    app.MapGrpcService<EventTablesService>()
        .EnableGrpcWeb()
        .RequireCors("AllowAll");

 
    app.MapGrpcService<RtuTreeService>()
          .EnableGrpcWeb()
          .RequireCors("AllowAll");
    app.MapGrpcService<RtuMgmtService>()
          .EnableGrpcWeb()
          .RequireCors("AllowAll"); 
    app.MapGrpcService<GraphService>()
          .EnableGrpcWeb()
          .RequireCors("AllowAll");
    app.MapGrpcService<GisService>()
          .EnableGrpcWeb()
          .RequireCors("AllowAll");

    if (startGrpcReflectionService)
    {
        // To utilize gRPC reflection, temporary change Kestrel settings in appsettings.json to:
        // "Protocols": "Http2"
        app.MapGrpcReflectionService();
    }
}


