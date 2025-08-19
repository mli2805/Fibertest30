using Iit.Fibertest.Graph;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Infrastructure;

public static class ConfigureServices
{

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services
        , IConfiguration configuration
        , string environmentName)
    {
        services.Configure<JwtSettings>(configuration.GetRequiredSection(JwtSettings.SectionName));

        services.AddSingleton<IDateTime, DateTimeService>();
        services.AddSingleton<IDelayService, DelayService>();
        services.AddDbContext<ServerDbContext>(c =>
        {
            string serverDbScheme = "ft30server";
            var mySqlAddress = configuration["MySqlServerAddress"] ?? "localhost";
            var mySqlPort = configuration["MySqlServerPort"] ?? "3306";
            var conStrTemplate = "server={0};port={1};user id=root;password=root;database={2}";
            var conString = string.Format(conStrTemplate, mySqlAddress, mySqlPort, serverDbScheme);
            c.UseMySql(conString, ServerVersion.AutoDetect(conString));
        });

        services.AddIdentityCore<ApplicationUser>(_ => { /*options.SignIn.RequireConfirmedAccount = true;*/ })
             .AddRoles<IdentityRole>()
             .AddEntityFrameworkStores<ServerDbContext>()
            //.AddDefaultTokenProviders()
            ;
        services.AddScoped<ServerDbContextInitializer>();

        services.AddDbContext<FtDbContext>(c =>
        {
            string myTablesScheme = "ft20efcore";
            var mySqlAddress = configuration["MySqlServerAddress"] ?? "localhost";
            var mySqlPort = configuration["MySqlServerPort"] ?? "3306";
            var conStrTemplate = "server={0};port={1};user id=root;password=root;database={2}";
            var connectionString = string.Format(conStrTemplate, mySqlAddress, mySqlPort, myTablesScheme);
            c.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        });
        services.AddScoped<FtDbContextInitializer>();


        services.AddHttpContextAccessor();
        services.AddScoped<SignInManager<ApplicationUser>>();

        services.Configure<IdentityOptions>(IdentityOptionsConfiguration.Configure);

        services.AddMemoryCache();

        services.AddScoped<IBaseRefRepairman, BaseRefRepairman>();
        services.AddScoped<IRtuStationsRepository, RtuStationsRepository>();
        services.AddScoped<SnapshotRepository>();
        services.AddScoped<SorFileRepository>();
        services.AddSingleton<EventLogComposer>();

        services.AddScoped<CommandAggregator>();
        services.AddScoped<EventsQueue>(); // Singleton?

        services.AddScoped<IShellCommandRt, ShellCommandRt>();
        services.AddScoped<IUpgradeService, UpgradeService>();

        services.AddSingleton<EventToLogLineParser>();
        services.AddSingleton<MySerializer>();
        services.AddSingleton<EventStoreInitializer>();
        services.AddScoped<IEventStoreService, EventStoreService>();

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IUserSettingsRepository, UserSettingsRepository>();
        services.AddScoped<INotificationSettingsRepository, NotificationSettingsRepository>();
        services.AddScoped<ISystemEventRepository, SystemEventRepository>();

        services.AddScoped<ISorFileRepository, SorFileRepository>();

        services.AddScoped<IEmailBuilder, EmailBuilder>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ISnmpService, SnmpService>();
        services.AddScoped<ILogProvider, LogProvider>();
        services.AddScoped<IPdfBuilder, PdfBuilder>();

        services.AddScoped<IRtuTransmitter, MakLinuxHttpTransmitter>();
        services.AddScoped<IRtuManager, RtuManager>();

        services.AddSingleton<IRtuOccupationService, RtuOccupationService>();
        services.AddSingleton<AccidentPlaceLocator>();
        services.AddSingleton<AccidentsFromSorExtractor>();
        services.AddSingleton<ProcessedResultsDtoFactory>();
        services.AddSingleton<IRtuCurrentStateDictionary, RtuCurrentStateDictionary>();
        services.AddSingleton<RtuDataProcessor>();
        services.AddSingleton<IRtuDataDispatcher, RtuDataDispatcher>();
        services.AddSingleton<IRtuLinuxPollster, RtuLinuxPollster>();

        return services;
    }
}

